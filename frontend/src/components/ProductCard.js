'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/translations';

export default function ProductCard({ product }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  if (!product) return null;

  const stars = (rating) => {
    const full = Math.round(rating || 4.5);
    return `${'★'.repeat(full)}${'☆'.repeat(Math.max(0, 5 - full))}`;
  };

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f7f8f8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" font-weight="700" fill="#111827">MotoMart</text></svg>`
      );
  };

  return (
    <article className="product-card" data-product={product.id}>
      <Link
        href={`/product/${product.id}`}
        className="product-image-button"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={handleImgError}
        />
      </Link>

      {product.badge && <span className="discount-badge">{product.badge}</span>}

      <div className="card-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span className="card-brand" style={{ fontWeight: '800' }}>
            {product.brand} {product.partType ? `• ${product.partType}` : ''}
          </span>
          {product.oemPartNumber && (
            <span style={{ fontSize: '10px', background: '#F1F5F9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
              OEM
            </span>
          )}
        </div>

        {product.oemPartNumber && (
          <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace', fontWeight: '600', marginBottom: '4px' }}>
            {product.oemPartNumber}
          </div>
        )}

        <Link href={`/product/${product.id}`} className="card-title-button">
          <span className="card-title">{product.name}</span>
        </Link>

        {product.fit && (
          <div style={{
            fontSize: '11px',
            color: '#059669',
            fontWeight: '600',
            marginTop: '2px',
            marginBottom: '4px',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            ✓ {product.fit}
          </div>
        )}

        {product.rating ? (
          <div className="rating">
            <span>{stars(product.rating)}</span> {product.rating} ·{' '}
            {(product.reviews || 0).toLocaleString('en-IN')}
          </div>
        ) : (
          <div className="rating">
            <span className={product.available === false ? 'stock out' : 'stock'}>
              {product.available === false ? 'Out of stock' : 'In stock'}
            </span>
          </div>
        )}

        <div className="price-line">
          <span className="price">{formatCurrency(product.price)}</span>
          {product.mrp > product.price && (
            <span className="mrp">{formatCurrency(product.mrp)}</span>
          )}
        </div>

        <span className="prime">
          {product.prime
            ? `✓ prime · ${t('FREE delivery')}`
            : t('Free delivery')}
        </span>

        <button
          className="add-cart"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product.id, 1, product.brand, {
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              mrp: product.mrp,
              image: product.image,
              category: product.category
            });
          }}
        >
          {t('Add to cart')}
        </button>
      </div>
    </article>
  );
}
