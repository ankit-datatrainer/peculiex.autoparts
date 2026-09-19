'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/translations';

export default function CartPageClient({ products = [], storeNotice = '' }) {
  const router = useRouter();
  const { t, local } = useLanguage();
  const { cart, cartSnapshots, updateQty, removeFromCart } = useCart();

  const [note, setNote] = useState('');

  const cartEntries = Object.entries(cart).filter(([id, qty]) => qty > 0);
  const items = cartEntries
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id) || cartSnapshots[id];
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const subtotalLabel = local(
    `Subtotal (${totalItems} items):`,
    `कुल (${totalItems} आइटम):`,
    `एकूण (${totalItems} वस्तू):`
  );

  return (
    <div className="cart-page-view page-shell">
      {items.length > 0 ? (
        <div className="cart-page-shell">
          <section className="cart-page-main">
            <Link className="cart-page-back" href="/">
              ← {t('Continue shopping')}
            </Link>
            <h1>{t('Shopping Cart')}</h1>

            {items.map((item) => (
              <article className="cart-page-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <Link href={`/product/${item.id}`}>
                    <h2>{item.name}</h2>
                  </Link>
                  <p className="in-stock">{t('In stock')}</p>
                  <p>{t('Eligible for FREE delivery')}</p>
                  <p>
                    <strong>{t('Fitment:')}</strong> {item.fit}
                  </p>
                  <div className="cart-page-actions">
                    <div className="qty-stepper">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQty(item.id, -1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQty(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-link"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      {t('Delete')}
                    </button>
                  </div>
                </div>
                <strong className="cart-page-price">
                  {formatCurrency(item.price * item.qty)}
                </strong>
              </article>
            ))}

            <div className="cart-page-subtotal">
              {subtotalLabel} <strong>{formatCurrency(subtotal)}</strong>
            </div>
          </section>

          <aside className="cart-summary">
            <h2>
              {subtotalLabel} <strong>{formatCurrency(subtotal)}</strong>
            </h2>

            <label className="cart-note">
              <span>{t('Add a note to this order')}</span>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('Fitment question, preferred delivery time, GST details…')}
                maxLength={500}
              />
              <small>{note.length}/500</small>
            </label>

            {storeNotice && <p className="cart-notice">{storeNotice}</p>}

            <button
              data-cart-checkout
              type="button"
              onClick={() =>
                router.push(`/checkout${note.trim() ? `?notes=${encodeURIComponent(note.trim())}` : ''}`)
              }
            >
              {t('Proceed to checkout')}
            </button>
            <small>
              🔒{' '}
              {local(
                'Secure checkout. Taxes included; delivery is calculated at checkout.',
                'सुरक्षित चेकआउट। कर शामिल हैं; डिलीवरी चेकआउट पर तय होगी।',
                'सुरक्षित चेकआउट. कर समाविष्ट; डिलिव्हरी चेकआउटवेळी मोजली जाईल.'
              )}
            </small>
          </aside>
        </div>
      ) : (
        <div className="cart-empty">
          <span>🛒</span>
          <div>
            <h1>{t('Your MotoMart cart is empty')}</h1>
            <p>{t('Shop today’s deals on bike parts, scooter accessories and riding gear.')}</p>
            <Link href="/" className="outline-cta" style={{ display: 'inline-block', marginTop: '1rem' }}>
              {t('Continue shopping')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
