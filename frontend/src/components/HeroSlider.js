'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSlider() {
  const router = useRouter();
  const { t } = useLanguage();
  const trackRef = useRef(null);

  const scrollSlide = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 330, behavior: 'smooth' });
    }
  };

  const goToCategory = (category) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="market-hero" aria-label="Featured auto-parts offers">
      <div className="market-hero-track" id="heroSlides" ref={trackRef}>
        <article className="promo-tile promo-dark">
          <div className="promo-copy-top">
            <p>{t('Rider safety kits')}</p>
            <h1>{t('Up to 35% off')}</h1>
            <span>{t('Helmets, gloves & mounts')}</span>
          </div>
          <img
            src="/assets/ai-riding-essentials.png"
            alt="Helmet, riding gloves and phone mount arrangement"
          />
          <button type="button" onClick={() => goToCategory('Riding Gear')}>
            {t('Shop safety gear')}
          </button>
        </article>

        <article className="promo-tile promo-silver">
          <div className="promo-copy-top">
            <p>{t('Service essentials')}</p>
            <h2>{t('Starting ₹399')}</h2>
            <span>{t('Chains, brakes, oils & plugs')}</span>
          </div>
          <img
            src="/assets/ai-maintenance-parts.png"
            alt="Motorcycle maintenance parts arrangement"
          />
          <button type="button" onClick={() => goToCategory('Engine & Oils')}>
            {t('See maintenance deals')}
          </button>
        </article>

        <article className="promo-tile promo-peach">
          <div className="promo-copy-top">
            <p>{t('Commuter upgrades')}</p>
            <h2>{t('Under ₹1,999')}</h2>
            <span>{t('Lights, mirrors & inflators')}</span>
          </div>
          <img
            src="/assets/ai-commuter-accessories.png"
            alt="Commuter bike accessories arrangement"
          />
          <button type="button" onClick={() => goToCategory('Accessories')}>
            {t('Explore accessories')}
          </button>
        </article>

        <article className="promo-tile promo-amber">
          <div className="promo-copy-top">
            <p>{t('Helmet clearance')}</p>
            <h2>{t('Up to 40% off')}</h2>
            <span>{t('ISI-rated protection')}</span>
          </div>
          <img
            src="/assets/ai-riding-essentials.png"
            alt="Full-face helmet and protective riding equipment"
          />
          <button type="button" onClick={() => goToCategory('Helmets')}>
            {t('Shop helmets')}
          </button>
        </article>

        <article className="promo-tile promo-white">
          <div className="promo-copy-top">
            <p>{t('Engine care store')}</p>
            <h2>{t('From ₹425')}</h2>
            <span>{t('Everyday oils for every ride')}</span>
          </div>
          <img
            src="/assets/ai-maintenance-parts.png"
            alt="Motorcycle engine care products"
          />
          <button type="button" onClick={() => goToCategory('Engine & Oils')}>
            {t('Shop engine care')}
          </button>
        </article>
      </div>

      <button
        className="market-arrow market-prev"
        id="heroPrev"
        aria-label="Previous offer"
        onClick={() => scrollSlide(-1)}
      >
        ‹
      </button>
      <button
        className="market-arrow market-next"
        id="heroNext"
        aria-label="Next offer"
        onClick={() => scrollSlide(1)}
      >
        ›
      </button>
    </section>
  );
}
