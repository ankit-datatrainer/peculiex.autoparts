'use client';

import React, { useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function HomeClientSections({ products = [] }) {
  const { t } = useLanguage();
  const { openModal } = useCart();
  const productRowRef = useRef(null);

  const scrollRow = (dir) => {
    if (productRowRef.current) {
      productRowRef.current.scrollBy({ left: dir * 500, behavior: 'smooth' });
    }
  };

  const popularProducts = products.slice(5, 20).concat(products.slice(0, 5));

  return (
    <>
      <section className="section page-shell" id="products">
        <div className="section-title">
          <div>
            <span className="eyebrow dark">{t('POPULAR WITH RIDERS')}</span>
            <h2 id="productsTitle">{t('Best sellers for bikes & scooters')}</h2>
          </div>
          <div className="section-actions">
            <button
              className="scroll-btn"
              type="button"
              aria-label={t('Scroll products left')}
              onClick={() => scrollRow(-1)}
            >
              ‹
            </button>
            <button
              className="scroll-btn"
              type="button"
              aria-label={t('Scroll products right')}
              onClick={() => scrollRow(1)}
            >
              ›
            </button>
          </div>
        </div>

        <div className="product-row" id="productRow" ref={productRowRef}>
          {popularProducts.map((p, idx) => (
            <ProductCard key={`${p.id}-${idx}`} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
