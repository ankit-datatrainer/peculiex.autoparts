'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function MaintenanceGrid() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleFilter = (category) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="section page-shell">
      <div className="section-title">
        <div>
          <span className="eyebrow dark">{t('ESSENTIAL MAINTENANCE')}</span>
          <h2>{t('Keep your ride road-ready')}</h2>
        </div>
        <button
          type="button"
          onClick={() => handleFilter('Engine & Oils')}
          style={{ border: 0, background: 'transparent', color: '#111', fontWeight: 700, cursor: 'pointer' }}
        >
          {t('View maintenance store')} <span>→</span>
        </button>
      </div>

      <div className="maintenance-grid">
        <button type="button" onClick={() => handleFilter('Engine & Oils')}>
          <span>01</span>
          <strong>{t('Engine care')}</strong>
          <small>{t('Oils, filters & spark plugs')}</small>
        </button>
        <button type="button" onClick={() => handleFilter('Brakes')}>
          <span>02</span>
          <strong>{t('Brake service')}</strong>
          <small>{t('Pads, discs & fluids')}</small>
        </button>
        <button type="button" onClick={() => handleFilter('Lighting')}>
          <span>03</span>
          <strong>{t('Electrical')}</strong>
          <small>{t('Lights, batteries & horns')}</small>
        </button>
        <button type="button" onClick={() => handleFilter('Tyres')}>
          <span>04</span>
          <strong>{t('Tyres & wheels')}</strong>
          <small>{t('Grip for every road')}</small>
        </button>
      </div>
    </section>
  );
}
