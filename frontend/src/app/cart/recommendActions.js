'use server';

import { getRecommendationsForCart } from '../../lib/recommendations';

/**
 * The cart lives in the browser, so the client hands us its product ids and we
 * work out what else fits those bikes. Returns a lean shape for the rails.
 */
export async function cartRecommendations(productIds = [], limit = 6) {
  const ids = (Array.isArray(productIds) ? productIds : []).filter(
    (id) => typeof id === 'string' && id.length < 120
  );
  if (!ids.length) return [];

  const items = await getRecommendationsForCart(ids.slice(0, 40), limit);

  return items.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    discountPercent: p.discountPercent,
    image: p.image,
    available: p.available
  }));
}
