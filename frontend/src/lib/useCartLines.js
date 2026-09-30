'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { priceCart } from '../app/cart/priceActions';
import { lineAmounts, orderTotals } from './commerce';

/**
 * The cart as display lines: each item merged from the curated feed, the
 * localStorage copy and fresh database prices, with its MOQ, GST rate and
 * line amounts. Amounts are null while prices are hidden from this viewer.
 */
export function useCartLines(products = []) {
  const { cart, cartSnapshots } = useCart();
  const { access, moqFor, gstFor } = useStore();
  const [fresh, setFresh] = useState({});

  const ids = Object.keys(cart)
    .filter((id) => cart[id] > 0)
    .sort();
  const key = ids.join(',');

  useEffect(() => {
    if (!access.canSee || !key) return undefined;
    let alive = true;
    priceCart(key.split(','))
      .then((res) => {
        if (alive && res) setFresh((prev) => ({ ...prev, ...res }));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [key, access.canSee]);

  const lines = ids
    .map((id) => {
      const known = products.find((p) => p.id === id) || cartSnapshots[id];
      if (!known && !fresh[id]) return null;
      const item = { ...(known || {}), ...(fresh[id] || {}), id };
      const qty = cart[id];
      const gstRate = gstFor(item);
      const hasPrice = access.canSee && item.price !== null && item.price !== undefined;
      return {
        ...item,
        qty,
        moq: moqFor(item),
        gstRate,
        amounts: hasPrice ? lineAmounts(item.price, qty, gstRate) : null
      };
    })
    .filter(Boolean);

  const priced = lines.filter((l) => l.amounts);
  const allPriced = lines.length > 0 && priced.length === lines.length;
  const sums = orderTotals(
    priced.map((l) => ({ price: l.price, qty: l.qty, gstRate: l.gstRate })),
    { freeShippingAbove: 0, shippingFee: 0 }
  );

  return {
    lines,
    totalItems: lines.reduce((sum, l) => sum + l.qty, 0),
    // Delivery is worked out at checkout; the cart shows goods + GST.
    totals: allPriced ? { subtotal: sums.subtotal, tax: sums.tax, total: sums.total } : null
  };
}
