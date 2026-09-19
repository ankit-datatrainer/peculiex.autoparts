'use server';

import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured, isAdmin } from '../../lib/supabase/server';

const DENIED = { error: 'Super admin access required.' };
const NOT_CONFIGURED = { error: 'Supabase is not configured for this site.' };

async function guard() {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  if (!(await isAdmin())) return DENIED;
  return null;
}

const str = (fd, key, fallback = '') => String(fd.get(key) ?? fallback).trim();
const num = (fd, key, fallback = 0) => {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : fallback;
};
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

function refreshStorefront(productId) {
  revalidatePath('/admin/products');
  revalidatePath('/brands');
  revalidatePath('/', 'layout');
  if (productId) revalidatePath(`/product/${productId}`);
}

// -----------------------------------------------------------------------------
// Images
// -----------------------------------------------------------------------------

/** Uploads one file to the product-images bucket and returns its public URL. */
async function uploadImage(supabase, file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (!file.type?.startsWith('image/')) throw new Error(`${file.name} is not an image`);
  if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB`);

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProductImages(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const productId = str(formData, 'product_id');
  const replace = str(formData, 'mode') === 'replace';
  const files = formData.getAll('images').filter((f) => f && typeof f !== 'string' && f.size > 0);

  if (!files.length) return { error: 'Choose at least one image.' };

  try {
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(supabase, file);
      if (url) urls.push(url);
    }

    const { data: current } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .maybeSingle();

    const next = replace ? urls : [...(current?.images || []), ...urls];

    const { error } = await supabase.from('products').update({ images: next }).eq('id', productId);
    if (error) return { error: error.message };

    refreshStorefront(productId);
    revalidatePath(`/admin/products/${productId}`);
    return { notice: `${urls.length} image${urls.length === 1 ? '' : 's'} uploaded.` };
  } catch (err) {
    return { error: err.message };
  }
}

export async function removeProductImage(productId, url) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const { data: current } = await supabase
    .from('products')
    .select('images')
    .eq('id', productId)
    .maybeSingle();

  const next = (current?.images || []).filter((i) => i !== url);
  const { error } = await supabase.from('products').update({ images: next }).eq('id', productId);
  if (error) return { error: error.message };

  // Only delete from storage if we are the ones hosting it.
  const marker = '/storage/v1/object/public/product-images/';
  if (url.includes(marker)) {
    await supabase.storage.from('product-images').remove([url.split(marker)[1]]);
  }

  refreshStorefront(productId);
  revalidatePath(`/admin/products/${productId}`);
  return { notice: 'Image removed.' };
}

export async function reorderProductImages(productId, urls) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const { error } = await supabase.from('products').update({ images: urls }).eq('id', productId);
  if (error) return { error: error.message };

  refreshStorefront(productId);
  return { notice: 'Image order saved.' };
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------
export async function saveProduct(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const isNew = str(formData, 'is_new') === '1';
  const name = str(formData, 'name');

  if (!name) return { error: 'Product name is required.' };

  const price = num(formData, 'price');
  const mrp = num(formData, 'mrp', price);
  if (price < 0 || mrp < 0) return { error: 'Prices cannot be negative.' };
  if (mrp && price > mrp) return { error: 'Selling price cannot be higher than the MRP.' };

  const id = isNew ? str(formData, 'id') || `mm-${slugify(name)}-${Date.now().toString(36)}` : str(formData, 'id');

  const row = {
    id,
    name,
    sku: str(formData, 'sku'),
    brand_id: str(formData, 'brand_id') || null,
    category_id: str(formData, 'category_id') || null,
    vendor: str(formData, 'vendor'),
    description: str(formData, 'description'),
    price,
    mrp: mrp || price,
    stock: Math.max(0, Math.round(num(formData, 'stock'))),
    fitment: str(formData, 'fitment'),
    is_active: formData.get('is_active') === 'on'
  };

  const tags = str(formData, 'tags');
  if (tags) row.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);

  let error;
  if (isNew) {
    ({ error } = await supabase.from('products').insert(row));
  } else {
    ({ error } = await supabase.from('products').update(row).eq('id', id));
  }
  if (error) return { error: error.message };

  // Fitment links
  const modelIds = formData.getAll('model_ids').map(String).filter(Boolean);
  if (formData.get('sync_models') === '1') {
    await supabase.from('product_models').delete().eq('product_id', id);
    if (modelIds.length) {
      await supabase
        .from('product_models')
        .insert(modelIds.map((model_id) => ({ product_id: id, model_id })));
    }
  }

  // Images attached on the create form
  const files = formData.getAll('images').filter((f) => f && typeof f !== 'string' && f.size > 0);
  if (files.length) {
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadImage(supabase, file);
        if (url) urls.push(url);
      }
      if (urls.length) {
        const { data: current } = await supabase
          .from('products')
          .select('images')
          .eq('id', id)
          .maybeSingle();
        await supabase
          .from('products')
          .update({ images: [...(current?.images || []), ...urls] })
          .eq('id', id);
      }
    } catch (err) {
      refreshStorefront(id);
      return { notice: 'Product saved, but an image failed: ' + err.message, id };
    }
  }

  refreshStorefront(id);
  revalidatePath(`/admin/products/${id}`);
  return { notice: isNew ? 'Product created.' : 'Product saved.', id };
}

export async function setProductActive(id, active) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const { error } = await supabase.from('products').update({ is_active: active }).eq('id', id);
  if (error) return { error: error.message };

  refreshStorefront(id);
  return { notice: active ? 'Product published.' : 'Product hidden.' };
}

export async function bulkProductAction(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const ids = formData.getAll('ids').map(String).filter(Boolean);
  const op = str(formData, 'op');
  if (!ids.length) return { error: 'Select at least one product.' };

  const supabase = createClient();
  let error;

  if (op === 'publish' || op === 'hide') {
    ({ error } = await supabase
      .from('products')
      .update({ is_active: op === 'publish' })
      .in('id', ids));
  } else if (op === 'delete') {
    ({ error } = await supabase.from('products').delete().in('id', ids));
  } else if (op === 'restock') {
    const stock = Math.max(0, Math.round(num(formData, 'stock', 25)));
    ({ error } = await supabase.from('products').update({ stock }).in('id', ids));
  } else {
    return { error: 'Unknown bulk action.' };
  }

  if (error) return { error: error.message };

  refreshStorefront();
  return { notice: `${ids.length} product${ids.length === 1 ? '' : 's'} updated.` };
}

export async function deleteProduct(id) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { error: error.message };

  refreshStorefront(id);
  return { notice: 'Product deleted.' };
}

/** Paste JSON or CSV to create many products at once. */
export async function importProducts(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const raw = str(formData, 'payload');
  if (!raw) return { error: 'Paste some rows first.' };

  let rows = [];
  try {
    if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
      const parsed = JSON.parse(raw);
      rows = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      const lines = raw.trim().split(/\r?\n/).filter(Boolean);
      const headers = lines[0].split(',').map((h) => h.trim());
      rows = lines.slice(1).map((line) => {
        // split on commas that are not inside quotes
        const cells = line.match(/("[^"]*"|[^,]+)/g) || [];
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = (cells[i] || '').trim().replace(/^"|"$/g, '');
        });
        return obj;
      });
    }
  } catch (err) {
    return { error: `Could not parse input: ${err.message}` };
  }

  if (!rows.length) return { error: 'No rows found.' };

  const prepared = rows
    .filter((r) => r.name)
    .map((r) => ({
      id: r.id || `mm-${slugify(r.name)}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(r.name),
      sku: r.sku || '',
      brand_id: r.brand_id || null,
      category_id: r.category_id || null,
      vendor: r.vendor || '',
      description: r.description || '',
      price: Number(r.price) || 0,
      mrp: Number(r.mrp) || Number(r.price) || 0,
      stock: Number.isFinite(Number(r.stock)) ? Math.max(0, Math.round(Number(r.stock))) : 0,
      images: r.images
        ? String(r.images)
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      fitment: r.fitment || '',
      is_active: String(r.is_active ?? 'true') !== 'false'
    }));

  if (!prepared.length) return { error: 'Every row needs at least a name.' };

  const supabase = createClient();
  const { error } = await supabase.from('products').upsert(prepared, { onConflict: 'id' });
  if (error) return { error: error.message };

  refreshStorefront();
  return { notice: `${prepared.length} product${prepared.length === 1 ? '' : 's'} imported.` };
}

// -----------------------------------------------------------------------------
// Categories, brands, models
// -----------------------------------------------------------------------------
export async function saveCategory(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const name = str(formData, 'name');
  if (!name) return { error: 'Category name is required.' };

  const row = {
    id: str(formData, 'id') || slugify(name),
    name,
    description: str(formData, 'description'),
    image: str(formData, 'image') || null,
    sort_order: Math.round(num(formData, 'sort_order')),
    is_active: formData.get('is_active') === 'on'
  };

  const supabase = createClient();
  const { error } = await supabase.from('categories').upsert(row, { onConflict: 'id' });
  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  refreshStorefront();
  return { notice: 'Category saved.' };
}

export async function deleteCategory(id) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  return { notice: 'Category deleted. Its products are now uncategorised.' };
}

export async function saveBrand(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const name = str(formData, 'name');
  if (!name) return { error: 'Brand name is required.' };

  const row = {
    id: str(formData, 'id') || slugify(name),
    name,
    tagline: str(formData, 'tagline'),
    logo: str(formData, 'logo') || null,
    hero_image: str(formData, 'hero_image') || null,
    sort_order: Math.round(num(formData, 'sort_order')),
    is_active: formData.get('is_active') === 'on'
  };

  const supabase = createClient();
  const { error } = await supabase.from('brands').upsert(row, { onConflict: 'id' });
  if (error) return { error: error.message };

  revalidatePath('/admin/brands');
  refreshStorefront();
  return { notice: 'Brand saved.' };
}

export async function saveModel(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const name = str(formData, 'name');
  const brandId = str(formData, 'brand_id');
  if (!name || !brandId) return { error: 'Model name and brand are required.' };

  const row = {
    brand_id: brandId,
    slug: str(formData, 'slug') || slugify(name),
    name,
    type: str(formData, 'type') === 'scooter' ? 'scooter' : 'bike',
    vehicle_type: str(formData, 'vehicle_type') || 'Motorcycle',
    image: str(formData, 'image') || null,
    is_active: formData.get('is_active') === 'on'
  };

  const id = str(formData, 'id');
  const supabase = createClient();

  const { error } = id
    ? await supabase.from('models').update(row).eq('id', id)
    : await supabase.from('models').insert(row);

  if (error) return { error: error.message };

  revalidatePath('/admin/brands');
  refreshStorefront();
  return { notice: 'Model saved.' };
}

export async function deleteModel(id) {
  const denied = await guard();
  if (denied) return denied;

  const supabase = createClient();
  const { error } = await supabase.from('models').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/brands');
  refreshStorefront();
  return { notice: 'Model deleted.' };
}

// -----------------------------------------------------------------------------
// Orders
// -----------------------------------------------------------------------------
export async function updateOrderStatus(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const id = str(formData, 'order_id');
  const status = str(formData, 'status');
  const note = str(formData, 'admin_note');

  const allowed = [
    'pending',
    'confirmed',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ];
  if (!allowed.includes(status)) return { error: 'Unknown status.' };

  const supabase = createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status, admin_note: note || null })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/account/orders/${id}`);
  return { notice: `Order marked ${status.replace(/_/g, ' ')}.` };
}

// -----------------------------------------------------------------------------
// Store settings
// -----------------------------------------------------------------------------
export async function saveSettings(_prevState, formData) {
  const denied = await guard();
  if (denied) return denied;

  const value = {
    name: str(formData, 'name'),
    supportPhone: str(formData, 'supportPhone'),
    supportEmail: str(formData, 'supportEmail'),
    freeShippingAbove: num(formData, 'freeShippingAbove', 999),
    shippingFee: num(formData, 'shippingFee', 59),
    cartNotice: str(formData, 'cartNotice')
  };

  const supabase = createClient();
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'store', value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  return { notice: 'Store settings saved.' };
}
