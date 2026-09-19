'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/translations';
import { loadCart, placeOrder } from './actions';

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal'
];

function PlaceOrderButton({ disabled }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="checkout-submit" disabled={pending || disabled}>
      {pending ? 'Placing your order…' : 'Place order · Pay on delivery'}
    </button>
  );
}

export default function CheckoutClient({ profile, email, notFromCart }) {
  const router = useRouter();
  const { cart, clearCart, showToast } = useCart();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], missing: [], settings: null });
  const [state, action] = useFormState(placeOrder, {});

  useEffect(() => {
    let alive = true;
    loadCart(cart).then((res) => {
      if (alive) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
    // resolve once on mount against the cart as it stands
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state?.success && state.order) {
      clearCart();
      showToast(`Order ${state.order.order_number} placed`);
      router.push(`/account/orders/${state.order.id}?placed=1`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  const items = data.items.filter((i) => !i.unavailable);
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const settings = data.settings || { freeShippingAbove: 999, shippingFee: 59 };
  const shipping = subtotal >= Number(settings.freeShippingAbove) ? 0 : Number(settings.shippingFee);
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="page-shell checkout-page">
        <p className="checkout-loading">Checking prices and stock…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="page-shell checkout-page">
        <div className="checkout-empty">
          <span aria-hidden="true">🛒</span>
          <h1>Your cart is empty</h1>
          <p>Add some parts and they will show up here.</p>
          <Link href="/brands" className="checkout-empty-cta">
            Shop spare parts by brand
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell checkout-page">
      <nav className="catalog-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link href="/cart">Cart</Link>
        <span aria-hidden="true">›</span>
        <strong>Checkout</strong>
      </nav>

      <h1 className="checkout-title">Checkout</h1>

      <form action={action} className="checkout-layout">
        <input
          type="hidden"
          name="cart"
          value={JSON.stringify(Object.fromEntries(items.map((i) => [i.id, i.qty])))}
        />

        <section className="checkout-main">
          <div className="checkout-card">
            <h2>Delivery address</h2>
            <div className="checkout-grid">
              <label className="span-2">
                <span>Full name *</span>
                <input name="customer_name" defaultValue={profile?.full_name || ''} required />
              </label>
              <label>
                <span>Mobile number *</span>
                <input
                  name="customer_phone"
                  inputMode="tel"
                  defaultValue={profile?.phone || ''}
                  placeholder="10-digit mobile"
                  required
                />
              </label>
              <label>
                <span>Email</span>
                <input value={email || ''} readOnly />
              </label>
              <label className="span-2">
                <span>Address *</span>
                <input name="address_line1" placeholder="House / flat, street" required />
              </label>
              <label className="span-2">
                <span>Landmark / area</span>
                <input name="address_line2" placeholder="Optional" />
              </label>
              <label>
                <span>City *</span>
                <input name="city" required />
              </label>
              <label>
                <span>State *</span>
                <select name="state" defaultValue="Karnataka" required>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Pin code *</span>
                <input name="pincode" inputMode="numeric" maxLength={6} required />
              </label>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Payment</h2>
            <label className="checkout-payment">
              <input type="radio" name="payment" defaultChecked readOnly />
              <span>
                <strong>Pay on delivery</strong>
                <small>Pay cash or UPI when your parts arrive. No online payment needed.</small>
              </span>
            </label>
          </div>

          <div className="checkout-card">
            <h2>Order notes</h2>
            <textarea
              name="notes"
              rows={3}
              placeholder="Anything we should know — preferred delivery time, fitment question, GST details…"
              defaultValue={notFromCart || ''}
            />
          </div>
        </section>

        <aside className="checkout-summary">
          <h2>Order summary</h2>

          {data.missing?.length > 0 && (
            <p className="checkout-warn">
              {data.missing.length} item{data.missing.length === 1 ? '' : 's'} in your cart are no
              longer in the catalog and have been removed.
            </p>
          )}

          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.image || '/assets/site-icon.svg'} alt="" />
                <div>
                  <Link href={`/product/${item.id}`}>{item.name}</Link>
                  <small>
                    {formatCurrency(item.price)} × {item.qty}
                    {item.reduced && <em> · only {item.stock} left, quantity reduced</em>}
                  </small>
                </div>
                <strong>{formatCurrency(item.lineTotal)}</strong>
              </li>
            ))}
          </ul>

          <dl className="checkout-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</dd>
            </div>
            <div className="grand">
              <dt>Total</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
          </dl>

          {state?.error && (
            <p className="checkout-error" role="alert">
              {state.error}
            </p>
          )}

          <PlaceOrderButton disabled={!items.length} />
          <small className="checkout-fineprint">
            By placing this order you agree to our returns and fitment policy. Taxes included.
          </small>
        </aside>
      </form>
    </div>
  );
}
