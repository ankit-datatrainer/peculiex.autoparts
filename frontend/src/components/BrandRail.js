'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function BrandRail({ brands = [] }) {
  const { t, tName } = useLanguage();
  const railRef = useRef(null);

  const scroll = (dir) => {
    if (railRef.current) railRef.current.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

  if (!brands.length) return null;

  return (
    <section className="section page-shell brand-rail-section" id="shop-by-brand">
      <div className="section-title">
        <div>
          <span className="eyebrow dark">{t('SPARES BY BIKE')}</span>
          <h2>{t('Shop spare parts by brand')}</h2>
          <p className="brand-rail-sub">{t('Genuine & OEM-grade fitment for every model')}</p>
        </div>
        <Link href="/brands">
          {t('View all brands')} <span>→</span>
        </Link>
      </div>

      <div className="brand-rail-wrap">
        <button
          type="button"
          className="brand-rail-arrow prev"
          aria-label={t('Scroll brands left')}
          onClick={() => scroll(-1)}
        >
          ‹
        </button>

        <div className="brand-rail" ref={railRef}>
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.id}`} className="brand-rail-card">
              <span className="brand-rail-media">
                <img src={brand.heroImage} alt={`${brand.name} spare parts`} loading="lazy" />
                {brand.logo && brand.logo !== brand.heroImage && (
                  <img className="brand-rail-logo" src={brand.logo} alt={`${brand.name} logo`} loading="lazy" />
                )}
              </span>
              <span className="brand-rail-body">
                <strong>
                  {brand.name.charAt(0) + brand.name.slice(1).toLowerCase()}
                  <span aria-hidden="true">›</span>
                </strong>
                <small>{tName(brand.tagline)}</small>
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="brand-rail-arrow next"
          aria-label={t('Scroll brands right')}
          onClick={() => scroll(1)}
        >
          ›
        </button>
      </div>
    </section>
  );
}
