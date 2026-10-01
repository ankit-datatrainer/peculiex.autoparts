'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function BrandPromo() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <section className="brand-promo page-shell">
      <div className="promo-copy">
        <span className="eyebrow">{t('GENUINE SPARES')}</span>
        <h2>{t('Parts that keep your ride on the road.')}</h2>
        <p>
          {t(
            'Brakes, chain kits, tyres, engine and electrical parts for every major bike and scooter brand, with the fitment listed on each part.'
          )}
        </p>
        <button className="outline-cta" type="button" onClick={() => router.push('/brands')}>
          {t('Shop spare parts by brand')}
        </button>
      </div>

      <div className="promo-visual">
        <img
          src="/assets/ai-genuine-parts.jpg"
          alt={t('Brake disc, chain sprocket kit and motorcycle tyre')}
          loading="lazy"
        />
        <div className="floating-stat">
          <strong>4.5★</strong>
          <span>{t('average rider rating')}</span>
        </div>
      </div>
    </section>
  );
}
