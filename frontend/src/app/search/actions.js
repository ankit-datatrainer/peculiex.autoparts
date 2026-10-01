'use server';

import { searchProducts, usingDatabase } from '../../lib/catalog';

/** Live suggestions for the header search box: names only, no prices. */
export async function suggestProducts(query = '') {
  const q = String(query || '').trim().slice(0, 80);
  if (q.length < 2 || !usingDatabase) return [];
  const rows = await searchProducts({ q, limit: 6 });
  return rows.map((p) => ({ id: p.id, name: p.name, brand: p.brand, category: p.category }));
}
