// =============================================================================
// ORDER STATUS
//
// The canonical enum → English label map, kept here rather than in the timeline
// component so that non-React code — the invoice PDF and the confirmation
// email — can localise a status without importing React.
//
// The English label doubles as the dictionary key, the same convention the rest
// of the site uses, so a status is translated by the ordinary t() lookup.
// =============================================================================

import { translations } from './translations.js';

export const ORDER_FLOW = [
  { id: 'pending', label: 'Order placed', hint: 'We have received your order' },
  { id: 'confirmed', label: 'Confirmed', hint: 'Payment method and stock verified' },
  { id: 'packed', label: 'Packed', hint: 'Your parts are boxed and labelled' },
  { id: 'shipped', label: 'Shipped', hint: 'Handed to the courier' },
  { id: 'out_for_delivery', label: 'Out for delivery', hint: 'Arriving today' },
  { id: 'delivered', label: 'Delivered', hint: 'Enjoy the ride' }
];

export const STATUS_LABEL = {
  pending: 'Order placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

/**
 * A localised status.
 *
 * Unknown values fall back to the raw enum with its underscores removed, so a
 * status added to the database later still reads as words rather than
 * `out_for_delivery`.
 */
export function statusLabel(status, lang = 'en') {
  const english = STATUS_LABEL[status] || String(status || '').replace(/_/g, ' ');
  if (lang === 'en') return english;
  return translations[lang]?.[english] || english;
}

const PAYMENT_LABEL = { cod: 'Pay on delivery' };

/** A localised payment method. */
export function paymentLabel(method, lang = 'en') {
  const english = PAYMENT_LABEL[method] || String(method || '').replace(/_/g, ' ');
  if (lang === 'en') return english;
  return translations[lang]?.[english] || english;
}
