'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../lib/translations';

const FALLBACK =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#111827">MotoMart</text></svg>`
  );

export default function PartCard({ part }) {
  const { addToCart } = useCart();
  const { t, tName, tCat } = useLanguage();
  if (!part) return null;

  const saving = part.mrp > part.price ? part.mrp - part.price : 0;

  return (
    <article className="part-card" data-product={part.id}>
      {saving > 0 && (
        <span className="part-save">
          {t('Save')} {formatCurrency(saving)}
        </span>
      )}

      <Link href={`/product/${part.id}`} className="part-card-media" aria-label={`${t('view')} ${tName(part.name, part.category)}`}>
        <img
          src={part.image || FALLBACK}
          alt={tName(part.name, part.category)}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK;
          }}
        />
      </Link>

      <div className="part-card-body">
        <div className="part-price-line">
          <span className="part-price">{formatCurrency(part.price)}</span>
          {saving > 0 && <span className="part-mrp">{formatCurrency(part.mrp)}</span>}
          {part.discountPercent > 0 && (
            <span className="part-off">
              {part.discountPercent}% {t('off')}
            </span>
          )}
        </div>

        <Link href={`/product/${part.id}`} className="part-title">
          {tName(part.name, part.category)}
        </Link>

        {/* The feed's vendor field often reads "OES Head Light Set" — a vendor
            code followed by the part type — so it goes through the name walker
            rather than being printed raw. */}
        <span className="part-vendor">{tName(part.vendor) || tCat(part.category)}</span>

        <span className={`part-stock ${part.available ? '' : 'out'}`}>
          <i aria-hidden="true">●</i> {part.available ? t('In stock') : t('Out of stock')}
        </span>

        <button
          type="button"
          className="part-add"
          disabled={!part.available}
          onClick={() =>
            addToCart(part.id, 1, part.brand, {
              id: part.id,
              name: part.name,
              brand: part.brand,
              price: part.price,
              mrp: part.mrp,
              image: part.image,
              category: part.category
            })
          }
        >
          {part.available ? t('Add to cart') : t('Out of stock')}
        </button>
      </div>
    </article>
  );
}
