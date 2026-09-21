'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../lib/translations';
import { cartRecommendations } from '../app/cart/recommendActions';

const FALLBACK =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f4f4f5"/></svg>`
  );

/**
 * "Goes well with your bike" rail.
 *
 * - `items` given  -> renders them (product page, server-rendered)
 * - no `items`     -> derives them from whatever is in the cart right now
 * `variant` controls the layout: "grid" (page) or "column" (cart drawer).
 */
export default function RecommendationRail({
  items = null,
  title,
  variant = 'grid',
  limit = 6,
  compact = false
}) {
  const { cart, addToCart } = useCart();
  const { t, tName } = useLanguage();
  const [derived, setDerived] = useState([]);
  const [loading, setLoading] = useState(items === null);

  const cartKey = Object.keys(cart || {})
    .filter((id) => cart[id] > 0)
    .sort()
    .join(',');

  useEffect(() => {
    if (items !== null) return undefined;

    let alive = true;
    const ids = cartKey ? cartKey.split(',') : [];

    if (!ids.length) {
      setDerived([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    cartRecommendations(ids, limit)
      .then((res) => {
        if (alive) {
          setDerived(res || []);
          setLoading(false);
        }
      })
      .catch(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [cartKey, items, limit]);

  const list = items !== null ? items : derived;

  if (loading && !list.length) return null;
  if (!list.length) return null;

  return (
    <section className={`rec-rail rec-${variant} ${compact ? 'rec-compact' : ''}`}>
      <h3 className="rec-title">{title || t('Goes well with your bike')}</h3>

      <div className="rec-items">
        {list.slice(0, limit).map((p) => (
          <article className="rec-card" key={p.id}>
            <Link href={`/product/${encodeURIComponent(p.id)}`} className="rec-media">
              <img
                src={p.image || FALLBACK}
                alt={tName(p.name, p.category)}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK;
                }}
              />
            </Link>

            <div className="rec-body">
              <Link
                href={`/product/${encodeURIComponent(p.id)}`}
                className="rec-name"
                title={tName(p.name, p.category)}
              >
                {tName(p.name, p.category)}
              </Link>

              <div className="rec-price">
                <strong>{formatCurrency(p.price)}</strong>
                {p.mrp > p.price && <s>{formatCurrency(p.mrp)}</s>}
                {p.discountPercent > 0 && <em>{p.discountPercent}% off</em>}
              </div>

              <button
                type="button"
                className="rec-add"
                disabled={p.available === false}
                onClick={() =>
                  addToCart(p.id, 1, p.brand, {
                    id: p.id,
                    name: p.name,
                    brand: p.brand,
                    price: p.price,
                    mrp: p.mrp,
                    image: p.image,
                    category: p.category
                  })
                }
              >
                {p.available === false ? t('Out of stock') : t('Add')}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
