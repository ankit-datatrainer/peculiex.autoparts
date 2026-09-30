// =============================================================================
// GST, MINIMUM ORDER QUANTITY AND LINE TOTALS
//
// Shared by the storefront, the cart, checkout and the invoice so every screen
// computes the same numbers the database charges in place_order().
//
// Selling prices are stored WITHOUT GST. Each product can carry its own GST %
// and MOQ; when it does not, the store-wide values from Admin → Settings apply.
// =============================================================================

export const DEFAULT_GST_RATE = 18;
export const DEFAULT_MOQ = 10;

/** Safety ceiling per cart line; place_order() refuses anything larger. */
export const MAX_QTY = 99999;

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const asRate = (value, fallback) => {
  const n = Number(value);
  return value !== null && value !== undefined && value !== '' && Number.isFinite(n) && n >= 0 && n <= 100
    ? n
    : fallback;
};

const asMoq = (value, fallback) => {
  const n = Math.floor(Number(value));
  return value !== null && value !== undefined && value !== '' && Number.isFinite(n) && n >= 1
    ? n
    : fallback;
};

/** The store-wide defaults, read from the settings row (or built-in defaults). */
export function storeCommerce(settings = {}) {
  return {
    gstRate: asRate(settings?.gstRate, DEFAULT_GST_RATE),
    defaultMoq: asMoq(settings?.defaultMoq, DEFAULT_MOQ)
  };
}

export function gstRateFor(product, store = {}) {
  return asRate(product?.gstRate, asRate(store.gstRate, DEFAULT_GST_RATE));
}

export function moqFor(product, store = {}) {
  return asMoq(product?.moq, asMoq(store.defaultMoq, DEFAULT_MOQ));
}

/** A typed or stepped quantity, kept between the MOQ and the safety ceiling. */
export function clampQty(qty, moq = 1) {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n)) return moq;
  return Math.min(MAX_QTY, Math.max(moq, n));
}

/**
 * Amounts for one line, rounded the way the database rounds them.
 * @returns {{ unit:number, qty:number, base:number, rate:number, tax:number, total:number }}
 */
export function lineAmounts(price, qty, rate) {
  const unit = Number(price) || 0;
  const q = Number(qty) || 0;
  const base = round2(unit * q);
  const tax = round2((base * (Number(rate) || 0)) / 100);
  return { unit, qty: q, base, rate: Number(rate) || 0, tax, total: round2(base + tax) };
}

/**
 * Totals for a list of { price, qty, gstRate } lines plus delivery.
 * The free-delivery threshold applies to the goods value before GST.
 */
export function orderTotals(lines, settings = {}) {
  let subtotal = 0;
  let tax = 0;
  for (const line of lines) {
    const a = lineAmounts(line.price, line.qty, line.gstRate);
    subtotal += a.base;
    tax += a.tax;
  }
  subtotal = round2(subtotal);
  tax = round2(tax);

  const freeAbove = Number(settings?.freeShippingAbove ?? 999);
  const fee = Number(settings?.shippingFee ?? 59);
  const shipping = lines.length === 0 || subtotal >= freeAbove ? 0 : fee;

  return { subtotal, tax, shipping, total: round2(subtotal + tax + shipping) };
}

/** "18" / "12.5" — for labels such as "GST (18%)". */
export function formatRate(rate) {
  const n = Number(rate) || 0;
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}
