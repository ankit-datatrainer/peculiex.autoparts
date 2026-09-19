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
        <span className="eyebrow">{t('RIDER PROTECT')}</span>
        <h2>{t('Gear that works as hard as you ride.')}</h2>
        <p>
          {t(
            'ISI-certified helmets, CE-rated gloves and high-visibility essentials from trusted riding brands.'
          )}
        </p>
        <button
          className="outline-cta"
          type="button"
          onClick={() => router.push('/search?category=Riding%20Gear')}
        >
          {t('Explore protective gear')}
        </button>
      </div>

      <div className="promo-visual">
        <img
          src="/assets/ai-riding-essentials.png"
          alt="Motorcycle helmet, gloves and phone mount"
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
