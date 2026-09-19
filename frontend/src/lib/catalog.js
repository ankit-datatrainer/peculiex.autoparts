// =============================================================================
// CATALOG ACCESS
// Reads brands / models / products from Supabase once it is configured, and
// falls back to the bundled JSON catalog otherwise, so the storefront keeps
// working before the migration is applied and during local development.
// =============================================================================

import { createClient, isSupabaseConfigured } from './supabase/server';
import * as jsonCatalog from './eautoCatalog';

export const usingDatabase = isSupabaseConfigured;

const discount = (price, mrp) =>
  mrp && mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

/** DB row -> the product shape the storefront components already render. */
export function mapProduct(row) {
  if (!row) return null;
  const off = discount(Number(row.price), Number(row.mrp));
  const images = row.images || [];

  return {
    id: row.id,
    name: row.name,
    sku: row.sku || '',
    oemPartNumber: row.sku || '',
    brand: row.brands?.name || row.brand_name || row.brand_id || '',
    brandId: row.brand_id || '',
    category: row.categories?.name || row.category_name || row.category_id || 'Spare Parts',
    categoryId: row.category_id || '',
    partType: row.categories?.name || row.category_id || '',
    vendor: row.vendor || '',
    description: row.description || '',
    price: Number(row.price),
    mrp: Number(row.mrp),
    discountPercent: off,
    badge: off ? `${off}% off` : '',
    stock: row.stock ?? 0,
    available: (row.stock ?? 0) > 0 && row.is_active !== false,
    isActive: row.is_active !== false,
    image: images[0] || null,
    images,
    fit: row.fitment || '',
    tags: row.tags || [],
    sourceUrl: row.source_url || null,
    modelId: row.model_slug || null,
    modelName: row.model_name || null
  };
}

const PRODUCT_COLUMNS =
  'id, name, sku, brand_id, category_id, vendor, description, price, mrp, stock, images, fitment, tags, source_url, is_active, brands(name), categories(name)';

// -----------------------------------------------------------------------------
// Brands
// -----------------------------------------------------------------------------
export async function getBrands() {
  if (!usingDatabase) return jsonCatalog.getBrands();

  const supabase = createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('id, name, tagline, logo, hero_image, sort_order, models(id, slug, name, type, image)')
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data?.length) {
    if (error) console.warn('catalog.getBrands fell back to JSON:', error.message);
    return jsonCatalog.getBrands();
  }

  const counts = await productCountsByBrand();

  return data
    .map((b) => ({
      id: b.id,
      name: b.name,
      tagline: b.tagline || '',
      logo: b.logo,
      heroImage: b.hero_image || b.logo,
      modelCount: b.models?.length || 0,
      partsCount: counts[b.id] || 0,
      bikeCount: (b.models || []).filter((m) => m.type === 'bike').length,
      scooterCount: (b.models || []).filter((m) => m.type === 'scooter').length,
      models: (b.models || [])
        .map((m) => ({
          id: m.slug,
          name: m.name,
          type: m.type,
          image: m.image,
          partsCount: 0,
          topCategories: []
        }))
        .sort((a, z) => a.name.localeCompare(z.name))
    }))
    .sort((a, z) => z.partsCount - a.partsCount);
}

async function productCountsByBrand() {
  const supabase = createClient();
  const { data } = await supabase.from('products').select('brand_id').eq('is_active', true);
  const counts = {};
  for (const row of data || []) counts[row.brand_id] = (counts[row.brand_id] || 0) + 1;
  return counts;
}

export async function getBrand(brandId) {
  const brands = await getBrands();
  const key = String(brandId || '').toLowerCase();
  return (
    brands.find((b) => b.id === key) || brands.find((b) => b.name.toLowerCase() === key) || null
  );
}

// -----------------------------------------------------------------------------
// Models + their parts
// -----------------------------------------------------------------------------
export async function getModel(brandId, modelSlug) {
  if (!usingDatabase) return jsonCatalog.getModel(brandId, modelSlug);

  const supabase = createClient();
  const { data: model, error } = await supabase
    .from('models')
    .select('id, slug, name, type, vehicle_type, image, brand_id, brands(name)')
    .eq('brand_id', brandId)
    .eq('slug', modelSlug)
    .maybeSingle();

  if (error || !model) {
    if (error) console.warn('catalog.getModel fell back to JSON:', error.message);
    return jsonCatalog.getModel(brandId, modelSlug);
  }

  const { data: links } = await supabase
    .from('product_models')
    .select(`product_id, products(${PRODUCT_COLUMNS})`)
    .eq('model_id', model.id);

  const parts = (links || [])
    .map((l) => l.products)
    .filter((p) => p && p.is_active)
    .map((p) => ({
      ...mapProduct(p),
      modelId: model.slug,
      modelName: model.name
    }));

  const counts = new Map();
  for (const p of parts) counts.set(p.category, (counts.get(p.category) || 0) + 1);

  return {
    brandId: model.brand_id,
    brandName: model.brands?.name || model.brand_id,
    modelId: model.slug,
    modelName: model.name,
    type: model.type,
    vehicleType: model.vehicle_type,
    image: model.image,
    categories: [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, z) => z.count - a.count || a.name.localeCompare(z.name)),
    parts
  };
}

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------
export async function getProductById(id) {
  if (!usingDatabase) {
    const part = await jsonCatalog.getPartById(id);
    return part ? jsonCatalog.partToProduct(part) : null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  const { data: fits } = await supabase
    .from('product_models')
    .select('models(slug, name, brand_id)')
    .eq('product_id', id);

  const first = fits?.[0]?.models;
  const product = mapProduct(data);

  return {
    ...product,
    modelId: first?.slug || null,
    modelName: first?.name || null,
    fitmentModels: (fits || []).map((f) => f.models?.name).filter(Boolean),
    about: product.description
      ? product.description.split(/(?<=\.)\s+/).filter(Boolean).slice(0, 4)
      : [`Genuine replacement ${product.category} for the ${product.brand}.`],
    specs: {
      Brand: product.vendor || product.brand,
      'Part Number': product.sku || '—',
      'Part Type': product.category,
      'Vehicle Brand': product.brand,
      Availability: product.available ? `In stock (${product.stock})` : 'Out of stock'
    }
  };
}

export async function getRelatedProducts(product, limit = 6) {
  if (!product) return [];

  if (!usingDatabase) {
    const part = await jsonCatalog.getPartById(product.id);
    const related = await jsonCatalog.getRelatedParts(part, limit);
    return related.map(jsonCatalog.partToProduct);
  }

  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('category_id', product.categoryId)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(limit);

  return (data || []).map(mapProduct);
}

export async function searchProducts({ q = '', brand = '', category = '', limit = 60 } = {}) {
  if (!usingDatabase) return [];

  const supabase = createClient();
  let query = supabase.from('products').select(PRODUCT_COLUMNS).eq('is_active', true);

  if (q) query = query.ilike('name', `%${q}%`);
  if (brand) query = query.eq('brand_id', brand);
  if (category) query = query.eq('category_id', category);

  const { data } = await query.limit(limit);
  return (data || []).map(mapProduct);
}

export async function getCategories() {
  if (!usingDatabase) return jsonCatalog.getPartCategories();

  const supabase = createClient();
  const { data } = await supabase
    .from('categories')
    .select('id, name, description, image, sort_order')
    .eq('is_active', true)
    .order('sort_order');

  return (data || []).map((c) => ({ ...c, count: 0 }));
}

export async function getStoreSettings() {
  const defaults = {
    name: 'MotoMart India',
    supportPhone: '+91 80000 00000',
    supportEmail: 'support@motomart.in',
    freeShippingAbove: 999,
    shippingFee: 59,
    cartNotice:
      'Orders are dispatched within 24 hours. Pay on delivery available across 18,000+ pin codes.'
  };
  if (!usingDatabase) return defaults;

  const supabase = createClient();
  const { data } = await supabase.from('settings').select('value').eq('key', 'store').maybeSingle();
  return { ...defaults, ...(data?.value || {}) };
}
