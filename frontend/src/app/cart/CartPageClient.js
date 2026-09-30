'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/translations';
import RecommendationRail from '../../components/RecommendationRail';
import { onImageError } from '../../lib/imageFallback';
import Price from '../../components/Price';
import QtyStepper from '../../components/QtyStepper';
import { useCartLines } from '../../lib/useCartLines';

export default function CartPageClient({ products = [], storeNotice = '' }) {
  const router = useRouter();
  const { t, tName, local } = useLanguage();
  const { setQty, removeFromCart } = useCart();

  const [note, setNote] = useState('');
  const { lines: items, totals, totalItems } = useCartLines(products);

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
                <img src={item.image} alt={item.name} onError={onImageError} />
                <div>
                  <Link href={`/product/${item.id}`}>
                    <h2>{tName(item.name, item.category)}</h2>
                  </Link>
                  {item.referenceNo && (
                    <p className="cart-ref">
                      {t('Reference No.')}: {item.referenceNo}
                    </p>
                  )}
                  <p className="in-stock">
                    {t('In stock')} · {t('MOQ')}: {item.moq} {t('units')}
                  </p>
                  <p>{t('Eligible for FREE delivery')}</p>
                  {item.fit && (
                    <p>
                      <strong>{t('Fitment:')}</strong> {item.fit}
                    </p>
                  )}
                  {item.amounts && (
                    <p className="cart-unit">
                      {formatCurrency(item.price)} × {item.qty} + {t('GST')} {item.gstRate}% ={' '}
                      <strong>{formatCurrency(item.amounts.total)}</strong>
                    </p>
                  )}
                  <div className="cart-page-actions">
                    <QtyStepper value={item.qty} min={item.moq} onChange={(q) => setQty(item.id, q)} />
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
                  <Price amount={item.amounts ? item.amounts.base : null} />
                </strong>
              </article>
            ))}

            <div className="cart-page-subtotal">
              {subtotalLabel}{' '}
              <strong>
                <Price amount={totals ? totals.subtotal : null} />
              </strong>
            </div>

            <RecommendationRail variant="grid" limit={6} />
          </section>

          <aside className="cart-summary">
            {totals ? (
              <dl className="cart-summary-totals">
                <div>
                  <dt>{subtotalLabel}</dt>
                  <dd>{formatCurrency(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>{t('GST')}</dt>
                  <dd>{formatCurrency(totals.tax)}</dd>
                </div>
                <div className="grand">
                  <dt>{t('Total (incl. GST)')}</dt>
                  <dd>{formatCurrency(totals.total)}</dd>
                </div>
              </dl>
            ) : (
              <h2>
                {subtotalLabel} <Price amount={null} size="lg" />
              </h2>
            )}

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
                'Secure checkout. GST is added per item; delivery is calculated at checkout.',
                'सुरक्षित चेकआउट। हर आइटम पर GST जुड़ता है; डिलीवरी चेकआउट पर तय होगी।',
                'सुरक्षित चेकआउट. प्रत्येक वस्तूवर GST जोडला जातो; डिलिव्हरी चेकआउटवेळी मोजली जाईल.',
                'સુરક્ષિત ચેકઆઉટ. દરેક વસ્તુ પર GST ઉમેરાય છે; ડિલિવરી ચેકઆઉટ વખતે ગણાશે.'
              )}
            </small>
            <RecommendationRail variant="column" limit={3} compact />
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
