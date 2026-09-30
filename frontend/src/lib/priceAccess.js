// =============================================================================
// WHO MAY SEE PRICES
//
// Prices are shown only to signed-in customers who have verified their email
// with a one-time code (and to admins). Everyone else sees a blurred price with
// a "log in" or "verify your email" link.
//
// Blurring alone would leave the real number in the page source, so server
// pages also pass their product data through hidePrices() before it reaches
// a client component.
// =============================================================================

import { cache } from 'react';
import { getSessionUser } from './supabase/server';

/** getSessionUser, run once per request however many components ask. */
export const getViewer = cache(getSessionUser);

const sameEmail = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

/**
 * @returns {Promise<{status:'guest'|'unverified'|'verified'|'admin', canSee:boolean, email:string|null}>}
 */
export const getPriceAccess = cache(async () => {
  const { user, profile } = await getViewer();
  if (!user) return { status: 'guest', canSee: false, email: null };
  if (profile?.role === 'admin') return { status: 'admin', canSee: true, email: user.email };

  // A verification belongs to the address that received the code; changing
  // the account email means verifying again.
  const verified = Boolean(profile?.email_verified_at) && sameEmail(profile?.verified_email, user.email);
  return { status: verified ? 'verified' : 'unverified', canSee: verified, email: user.email };
});

const PRICE_KEYS = new Set(['price', 'mrp', 'lineTotal', 'line_total', 'saving']);

/** Deep copy of `data` with every price-like field set to null. */
export function hidePrices(data) {
  if (Array.isArray(data)) return data.map(hidePrices);
  if (!data || typeof data !== 'object' || data instanceof Date) return data;

  const out = {};
  for (const [key, value] of Object.entries(data)) {
    out[key] = PRICE_KEYS.has(key) ? null : hidePrices(value);
  }
  return out;
}

/** hidePrices() unless the current viewer is allowed to see them. */
export async function forViewer(data) {
  const access = await getPriceAccess();
  return access.canSee ? data : hidePrices(data);
}
