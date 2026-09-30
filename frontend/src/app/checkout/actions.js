'use server';

import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { mapProduct, getStoreSettings } from '../../lib/catalog';
import { renderInvoicePdf } from '../../lib/invoice';
import { sendInvoiceEmail } from '../../lib/email';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../lib/translations';
import { getPriceAccess } from '../../lib/priceAccess';
import { storeCommerce, gstRateFor, moqFor, clampQty, lineAmounts } from '../../lib/commerce';
import { cookies, headers } from 'next/headers';

/**
 * Resolves the browser's cart (ids + quantities) against the database so the
 * checkout page shows real prices, real stock and real names — never whatever
 * was cached in localStorage.
 */
export async function loadCart(cart) {
  if (!isSupabaseConfigured) return { items: [], settings: null, error: 'not-configured' };

  const ids = Object.keys(cart || {}).filter((id) => cart[id] > 0);
  if (!ids.length) return { items: [], settings: null };

  const access = await getPriceAccess();
  if (!access.canSee) return { items: [], settings: null, error: 'verify-email' };

  const supabase = createClient();

  const [{ data: rows, error }, store] = await Promise.all([
    supabase.from('products').select('*, brands(name), categories(name)').in('id', ids),
    getStoreSettings()
  ]);

  if (error) return { items: [], settings: null, error: error.message };

  const commerce = storeCommerce(store);
  const items = (rows || []).map((row) => {
    const product = mapProduct(row);
    const moq = moqFor(product, commerce);
    const gstRate = gstRateFor(product, commerce);
    const requested = Number(cart[row.id]) || moq;
    // Quantity is not capped by stock any more; only lifted to the MOQ.
    const qty = clampQty(requested, moq);
    const amounts = lineAmounts(product.price, qty, gstRate);
    return {
      ...product,
      moq,
      gstRate,
      requestedQty: requested,
      qty,
      lineTotal: amounts.base,
      tax: amounts.tax,
      unavailable: !product.isActive || product.stock === 0,
      raisedToMoq: qty > requested
    };
  });

  // ids the browser has but the catalog no longer does
  const missing = ids.filter((id) => !items.some((i) => i.id === id));

  return { items, missing, settings: store };
}

export async function placeOrder(_prevState, formData) {
  if (!isSupabaseConfigured) return { error: 'Checkout is not available — Supabase is not configured.' };

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Please sign in to place your order.' };

  const access = await getPriceAccess();
  if (!access.canSee) return { error: 'Verify your email before placing an order.' };

  let cart;
  try {
    cart = JSON.parse(String(formData.get('cart') || '{}'));
  } catch {
    return { error: 'Your cart could not be read. Please try again.' };
  }

  const items = Object.entries(cart)
    .filter(([, qty]) => Number(qty) > 0)
    .map(([product_id, qty]) => ({ product_id, qty: Number(qty) }));

  if (!items.length) return { error: 'Your cart is empty.' };

  const required = ['customer_name', 'customer_phone', 'address_line1', 'city', 'state', 'pincode'];
  const payload = { items };
  for (const field of [...required, 'address_line2', 'notes']) {
    payload[field] = String(formData.get(field) || '').trim();
  }
  payload.customer_email = user.email;

  for (const field of required) {
    if (!payload[field]) return { error: 'Fill in every required delivery field.' };
  }
  if (!/^\d{6}$/.test(payload.pincode)) return { error: 'Enter a valid 6-digit pin code.' };
  if (!/^\d{10}$/.test(payload.customer_phone.replace(/\D/g, '').slice(-10))) {
    return { error: 'Enter a valid 10-digit mobile number.' };
  }

  const { data, error } = await supabase.rpc('place_order', { payload });

  if (error) {
    const raw = error.message || '';
    if (raw.includes('OUT_OF_STOCK')) {
      return { error: `Out of stock: ${raw.split('OUT_OF_STOCK:')[1]?.trim() || 'item unavailable'}` };
    }
    if (raw.includes('BELOW_MOQ')) {
      return { error: `Below the minimum order quantity: ${raw.split('BELOW_MOQ:')[1]?.trim() || ''}` };
    }
    if (raw.includes('QTY_TOO_LARGE')) {
      return { error: 'Quantity is too large for one order. Split it into smaller orders.' };
    }
    if (raw.includes('EMAIL_NOT_VERIFIED')) return { error: 'Verify your email before placing an order.' };
    if (raw.includes('PRODUCT_UNAVAILABLE')) {
      return { error: 'One of your items is no longer available. Remove it and try again.' };
    }
    if (raw.includes('EMPTY_CART')) return { error: 'Your cart is empty.' };
    if (raw.includes('AUTH_REQUIRED')) return { error: 'Please sign in to place your order.' };
    return { error: raw };
  }

  // Save the address back onto the profile for next time.
  await supabase
    .from('profiles')
    .update({ full_name: payload.customer_name, phone: payload.customer_phone })
    .eq('id', user.id);

  // Invoice + confirmation email. Best effort: a mail failure must not lose the
  // order, which is already committed at this point.
  await emailInvoice(supabase, data.id).catch((err) =>
    console.error('invoice email failed:', err.message)
  );

  revalidatePath('/account');
  return { success: true, order: data };
}

/** Renders the invoice for a freshly placed order and emails it to the buyer. */
async function emailInvoice(supabase, orderId) {
  const [{ data: order }, { data: items }, store] = await Promise.all([
    supabase.from('orders').select('*').eq('id', orderId).maybeSingle(),
    supabase.from('order_items').select('*').eq('order_id', orderId),
    getStoreSettings()
  ]);
  if (!order) return;

  // The language the shopper had selected when they placed the order; an
  // unrecognised cookie value must not end up in the email's lang attribute.
  const cookieLang = cookies().get('motomart-language')?.value;
  const lang = SUPPORTED_LANGUAGES.includes(cookieLang) ? cookieLang : DEFAULT_LANGUAGE;

  const host = headers().get('host') || '';
  const proto = headers().get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (host ? `${proto}://${host}` : '');

  const pdf = await renderInvoicePdf(order, items || [], { lang, store });
  const result = await sendInvoiceEmail({ order, pdf, items: items || [], lang, siteUrl });

  if (!result.sent && result.reason !== 'not-configured') {
    console.warn('invoice email not delivered:', result);
  }
}
