// =============================================================================
// CATEGORY GROUPS
//
// The catalog has 86 flat part categories; riders shop by a handful of groups.
// Migration 0002 stores these in `category_groups` so the admin can edit them.
// Until that migration is applied the same grouping is derived here from the
// category names, so the storefront works either way.
// =============================================================================

import { createClient, isSupabaseConfigured } from './supabase/server';
import { GROUP_RULES, groupForCategory } from './categoryGroupRules';

export { GROUP_RULES, groupForCategory };

/** True once migration 0002 has been applied. */
async function hasGroupTable(supabase) {
  const { error } = await supabase.from('category_groups').select('id').limit(1);
  return !error;
}

/**
 * All groups with their member categories and product counts.
 * Prefers the database (admin-editable) and falls back to the rules above.
 */
export async function getCategoryGroups() {
  if (!isSupabaseConfigured) return [];

  const supabase = createClient();
  const fromDb = await hasGroupTable(supabase);

  const [{ data: categories }, counts] = await Promise.all([
    supabase
      .from('categories')
      .select(fromDb ? 'id, name, image, group_id' : 'id, name, image')
      .eq('is_active', true)
      .order('name'),
    categoryCounts(supabase)
  ]);

  let groupMeta = GROUP_RULES.map((g, i) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    image: null,
    sortOrder: i
  }));

  if (fromDb) {
    const { data: rows } = await supabase
      .from('category_groups')
      .select('id, name, description, image, sort_order')
      .eq('is_active', true)
      .order('sort_order');

    if (rows?.length) {
      groupMeta = rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        image: r.image,
        sortOrder: r.sort_order
      }));
    }
  }

  const byGroup = new Map(groupMeta.map((g) => [g.id, { ...g, categories: [], partsCount: 0 }]));

  for (const cat of categories || []) {
    const gid = fromDb && cat.group_id ? cat.group_id : groupForCategory(cat.name);
    const bucket = byGroup.get(gid);
    if (!bucket) continue;

    const n = counts[cat.id] || 0;
    bucket.categories.push({ id: cat.id, name: cat.name, image: cat.image, count: n });
    bucket.partsCount += n;
    if (!bucket.image && cat.image) bucket.image = cat.image;
  }

  return [...byGroup.values()]
    .filter((g) => g.categories.length > 0)
    .map((g) => ({
      ...g,
      categories: g.categories.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryGroup(groupId) {
  const groups = await getCategoryGroups();
  return groups.find((g) => g.id === String(groupId || '').toLowerCase()) || null;
}

/** Product counts per category, via the RPC when present, else paged. */
async function categoryCounts(supabase) {
  const { data, error } = await supabase.rpc('catalog_counts');
  if (!error && data?.categories) return data.categories;

  const counts = {};
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data: rows, error: err } = await supabase
      .from('products')
      .select('category_id')
      .eq('is_active', true)
      .range(from, from + PAGE - 1);
    if (err || !rows?.length) break;
    for (const r of rows) if (r.category_id) counts[r.category_id] = (counts[r.category_id] || 0) + 1;
    if (rows.length < PAGE) break;
  }
  return counts;
}

/** Products inside a group, optionally narrowed to one brand or category. */
export async function getGroupProducts(groupId, { brand = '', category = '', page = 1, pageSize = 36 } = {}) {
  const group = await getCategoryGroup(groupId);
  if (!group) return null;

  const supabase = createClient();
  const categoryIds = category
    ? [category]
    : group.categories.map((c) => c.id);

  if (!categoryIds.length) return { group, products: [], total: 0 };

  const from = (page - 1) * pageSize;
  let query = supabase
    .from('products')
    .select(
      'id, name, sku, brand_id, category_id, vendor, description, price, mrp, stock, images, fitment, tags, source_url, is_active, brands(name), categories(name)',
      { count: 'exact' }
    )
    .in('category_id', categoryIds)
    .eq('is_active', true);

  if (brand) query = query.eq('brand_id', brand);

  const { data, count } = await query.order('stock', { ascending: false }).range(from, from + pageSize - 1);

  return { group, rows: data || [], total: count || 0 };
}
