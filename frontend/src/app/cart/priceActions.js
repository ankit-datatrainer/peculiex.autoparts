'use server';

import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { mapProduct } from '../../lib/catalog';
import { getPriceAccess } from '../../lib/priceAccess';

/**
 * Current prices for the parts in the browser's cart.
 *
 * The cart keeps a copy of each item in localStorage, and that copy has no
 * price if it was added before the shopper verified their email (or the price
 * has changed since). The cart drawer and page ask for fresh numbers here —
 * and get them only when the viewer is allowed to see prices.
 */
export async function priceCart(productIds = []) {
  const ids = (Array.isArray(productIds) ? productIds : [])
    .filter((id) => typeof id === 'string' && id.length < 120)
    .slice(0, 200);
  if (!ids.length || !isSupabaseConfigured) return {};

  const access = await getPriceAccess();
  if (!access.canSee) return {};

  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(name), categories(name)')
    .in('id', ids);
  if (error) return {};

  return Object.fromEntries(
    (data || []).map((row) => {
      const p = mapProduct(row);
      return [
        p.id,
        {
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          image: p.image,
          price: p.price,
          mrp: p.mrp,
          moq: p.moq,
          gstRate: p.gstRate,
          referenceNo: p.referenceNo,
          available: p.available
        }
      ];
    })
  );
}
