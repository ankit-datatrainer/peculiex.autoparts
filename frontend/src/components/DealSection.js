'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';

export default function DealSection({ products = [] }) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState('08:42:16');

  useEffect(() => {
    let totalSeconds = 8 * 3600 + 42 * 60 + 16;
    const interval = setInterval(() => {
      totalSeconds = Math.max(0, totalSeconds - 1);
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(totalSeconds % 60).padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dealProducts = products.slice(0, 8);

  return (
    <section className="section deal-section" id="deals">
      <div className="page-shell">
        <div className="section-title light">
          <div>
            <span className="eyebrow">{t('LIMITED-TIME PRICES')}</span>
            <h2>{t("Today’s garage deals")}</h2>
          </div>
          <div className="deal-timer">
            <span>{t('Ends in')}</span>
            <strong id="dealTimer">{timeLeft}</strong>
          </div>
        </div>

        <div className="product-scroller" id="dealScroller">
          {dealProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
