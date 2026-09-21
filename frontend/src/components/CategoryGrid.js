'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { companyBrands, bikePartTypes } from '../lib/catalogData';

export default function CategoryGrid({ categories = [] }) {
  const router = useRouter();
  const { t, tCat } = useLanguage();

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f7f8f8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#111827">MotoMart</text></svg>`
      );
  };

  return (
    <section className="section page-shell" id="categories">
      {/* 12 Company Brands Category Grid */}
      <div className="section-title">
        <div>
          <span className="eyebrow dark">{t('OFFICIAL MANUFACTURER SPARES')}</span>
          <h2>{t('Shop Genuine Spares by Company')}</h2>
          <p style={{ color: '#64748B', margin: '4px 0 0 0', fontSize: '14px' }}>
            {t("Direct factory fitment for scooters and bikes across India's top two-wheeler brands.")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/search')}
          style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {t('View all brands')} <span>→</span>
        </button>
      </div>

      <div className="category-grid" id="categoryGrid" style={{ marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {companyBrands.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => router.push(`/search?brand=${encodeURIComponent(b.name)}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              height: '210px',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#DC2626';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F8FAFC',
              borderRadius: '10px',
              padding: '1.2rem',
              width: '100%',
              overflow: 'hidden'
            }}>
              <img
                src={b.image}
                alt={`${b.name} ${t('official logo')}`}
                loading="lazy"
                onError={handleImgError}
                style={{
                  maxHeight: '60px',
                  maxWidth: '85%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.85rem',
              width: '100%'
            }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.01em' }}>
                  {b.name}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {b.models.scooters.length > 0 && b.models.bikes.length > 0
                    ? t('Scooters & Bikes')
                    : b.models.scooters.length > 0
                      ? t('Electric & Petrol')
                      : t('Bikes & Cruisers')}
                </span>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                →
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 10 Vital Bike Parts Grid */}
      <div className="section-title">
        <div>
          <span className="eyebrow dark">{t('ESSENTIAL SPARE PARTS')}</span>
          <h2>{t('Shop by Bike Part Category')}</h2>
          <p style={{ color: '#64748B', margin: '4px 0 0 0', fontSize: '14px' }}>
            {t('Precision-engineered replacement components tested to factory tolerance.')}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '0.85rem',
        marginTop: '1rem'
      }}>
        {bikePartTypes.map((pt) => {
          const partSlug = pt.toLowerCase().replace(' ', '-');
          return (
            <button
              key={pt}
              type="button"
              onClick={() => router.push(`/search?partType=${encodeURIComponent(pt)}`)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem 0.75rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#DC2626';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(220,38,38,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 8px auto',
                borderRadius: '50%',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img
                  src={`/assets/parts/${partSlug}.jpg`}
                  alt={tCat(pt)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={handleImgError}
                />
              </div>
              <strong style={{ display: 'block', fontSize: '13px', color: '#0F172A', fontWeight: '800' }}>
                {tCat(pt)}
              </strong>
              <small style={{ fontSize: '11px', color: '#64748B' }}>{t('OEM Spares')}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
