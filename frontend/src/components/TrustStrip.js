'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TrustStrip() {
  const { t } = useLanguage();

  return (
    <section className="trust-strip" aria-label={t('Shopping benefits')}>
      <div>
        <span>✓</span>
        <strong>{t('Verified fitment')}</strong>
        <small>{t('Vehicle-compatible parts')}</small>
      </div>
      <div>
        <span>↩</span>
        <strong>{t('10-day returns')}</strong>
        <small>{t('Easy replacement support')}</small>
      </div>
      <div>
        <span>⚡</span>
        <strong>{t('Fast delivery')}</strong>
        <small>{t('Across 18,000+ pin codes')}</small>
      </div>
      <div>
        <span>🛡</span>
        <strong>{t('Secure payments')}</strong>
        <small>{t('UPI, cards & pay on delivery')}</small>
      </div>
    </section>
  );
}
