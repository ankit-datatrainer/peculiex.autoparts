// =============================================================================
// PRODUCT RECOMMENDATIONS
//
// Riders shop by what fits their bike, so relevance is ranked:
//   1. fits the same model   (strongest signal — it is the same vehicle)
//   2. same part category    (a brake pad shopper also needs discs, fluid)
//   3. same vehicle brand    (keeps the list on-brand rather than random)
// Out-of-stock and already-in-cart items never appear; ties break on the
// biggest saving so the rail still looks like an offer.
// =============================================================================

import { createClient, isSupabaseConfigured } from './supabase/server';
import { mapProduct } from './catalog';
import * as jsonCatalog from './eautoCatalog';

const COLUMNS =
  'id, name, sku, brand_id, category_id, vendor, description, price, mrp, stock, images, fitment, tags, source_url, is_active, brands(name), categories(name)';

const saving = (p) => Math.max(0, Number(p.mrp || 0) - Number(p.price || 0));

function rank(rows, { categoryIds = [], brandIds = [], modelProductIds = [] }) {
  const cats = new Set(categoryIds);
  const brands = new Set(brandIds);
  const models = new Set(modelProductIds);

  return rows
    .map((p) => {
      let score = 0;
      if (models.has(p.id)) score += 100;
      if (cats.has(p.category_id)) score += 40;
      if (brands.has(p.brand_id)) score += 10;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || saving(b.p) - saving(a.p))
    .map((x) => x.p);
}

/**
 * @param {object}   opts
 * @param {string[]} opts.categoryIds  categories to prefer
 * @param {string[]} opts.brandIds     brands to prefer
 * @param {string[]} opts.modelIds     model uuids whose parts to prefer
 * @param {string[]} opts.exclude      product ids to leave out (cart, current item)
 */
export async function getRecommendations({
  categoryIds = [],
  brandIds = [],
  modelIds = [],
  exclude = [],
  limit = 8
} = {}) {
  if (!isSupabaseConfigured) return [];

  const supabase = createClient();
  const skip = new Set(exclude);
  const pool = new Map();

  const add = (rows) => {
    for (const row of rows || []) {
      if (!skip.has(row.id) && !pool.has(row.id)) pool.set(row.id, row);
    }
  };

  // 1. parts that fit the same model
  let modelProductIds = [];
  if (modelIds.length) {
    const { data: links } = await supabase
      .from('product_models')
      .select(`product_id, products(${COLUMNS})`)
      .in('model_id', modelIds)
      .limit(limit * 6);

    const rows = (links || []).map((l) => l.products).filter((p) => p && p.is_active && p.stock > 0);
    modelProductIds = rows.map((r) => r.id);
    add(rows);
  }

  // 2. same category
  if (pool.size < limit * 3 && categoryIds.length) {
    const { data } = await supabase
      .from('products')
      .select(COLUMNS)
      .in('category_id', categoryIds)
      .eq('is_active', true)
      .gt('stock', 0)
      .limit(limit * 4);
    add(data);
  }

  // 3. same brand, to top up a thin list
  if (pool.size < limit && brandIds.length) {
    const { data } = await supabase
      .from('products')
      .select(COLUMNS)
      .in('brand_id', brandIds)
      .eq('is_active', true)
      .gt('stock', 0)
      .limit(limit * 3);
    add(data);
  }

  return rank([...pool.values()], { categoryIds, brandIds, modelProductIds })
    .slice(0, limit)
    .map(mapProduct);
}

/** Recommendations for a single product page. */
export async function getRecommendationsForProduct(product, limit = 8) {
  if (!product) return [];

  if (!isSupabaseConfigured) {
    const part = await jsonCatalog.getPartById(product.id);
    const related = await jsonCatalog.getRelatedParts(part, limit);
    return related.map(jsonCatalog.partToProduct);
  }

  const supabase = createClient();
  const { data: fits } = await supabase
    .from('product_models')
    .select('model_id')
    .eq('product_id', product.id);

  return getRecommendations({
    categoryIds: product.categoryId ? [product.categoryId] : [],
    brandIds: product.brandId ? [product.brandId] : [],
    modelIds: (fits || []).map((f) => f.model_id),
    exclude: [product.id],
    limit
  });
}

/**
 * Recommendations for a basket: looks at what is already in it and suggests
 * parts for the same bikes. Used by the cart drawer, cart page and checkout.
 */
export async function getRecommendationsForCart(productIds = [], limit = 6) {
  if (!isSupabaseConfigured || !productIds.length) return [];

  const supabase = createClient();

  const [{ data: inCart }, { data: fits }] = await Promise.all([
    supabase.from('products').select('id, brand_id, category_id').in('id', productIds),
    supabase.from('product_models').select('model_id').in('product_id', productIds)
  ]);

  return getRecommendations({
    categoryIds: [...new Set((inCart || []).map((p) => p.category_id).filter(Boolean))],
    brandIds: [...new Set((inCart || []).map((p) => p.brand_id).filter(Boolean))],
    modelIds: [...new Set((fits || []).map((f) => f.model_id))],
    exclude: productIds,
    limit
  });
}
