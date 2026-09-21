import React from 'react';
import { getT } from '../../lib/i18n-server';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { getBrands } from '../../lib/catalog';

export const revalidate = 0;

export const metadata = {
  title: 'Shop Spare Parts by Brand | MotoMart India',
  description:
    'Pick your manufacturer, then your bike or scooter model, and see every spare part that fits it.'
};

export default async function BrandsPage() {
  const brands = await getBrands();
  const totalParts = brands.reduce((n, b) => n + b.partsCount, 0);
  const totalModels = brands.reduce((n, b) => n + b.modelCount, 0);

  const { t, tName, local } = getT();

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell catalog-page">
          <nav className="catalog-crumbs" aria-label={t('Breadcrumb')}>
            <Link href="/">{t('Home')}</Link>
            <span aria-hidden="true">›</span>
            <strong>{t('Bike Brands')}</strong>
          </nav>

          <header className="catalog-head">
            <span className="eyebrow dark">{t('SPARES BY BIKE')}</span>
            <h1>{t('Shop spare parts by brand')}</h1>
            <p>
              {local(
                `${brands.length} manufacturers · ${totalModels} models · ${totalParts.toLocaleString('en-IN')} genuine & OEM-grade parts. Choose a brand to see its bikes and scooters.`,
                `${brands.length} निर्माता · ${totalModels} मॉडल · ${totalParts.toLocaleString('en-IN')} असली और OEM-ग्रेड पार्ट्स। ब्रांड चुनें और उसकी बाइक व स्कूटर देखें।`,
                `${brands.length} उत्पादक · ${totalModels} मॉडेल · ${totalParts.toLocaleString('en-IN')} अस्सल आणि OEM-ग्रेड पार्ट्स. ब्रँड निवडा आणि त्याच्या बाइक व स्कूटर पाहा.`,
                `${brands.length} ઉત્પાદક · ${totalModels} મોડેલ · ${totalParts.toLocaleString('en-IN')} અસલી અને OEM-ગ્રેડ પાર્ટ્સ. બ્રાન્ડ પસંદ કરો અને તેની બાઇક અને સ્કૂટર જુઓ.`
              )}
            </p>
          </header>

          <div className="brand-grid">
            {brands.map((brand) => (
              <Link key={brand.id} href={`/brands/${brand.id}`} className="brand-card">
                <span className="brand-card-media">
                  <img
                    src={brand.heroImage}
                    alt={`${brand.name} ${t('Spare Parts')}`}
                    loading="lazy"
                  />
                  {brand.logo && brand.logo !== brand.heroImage && (
                    <img
                      className="brand-card-logo"
                      src={brand.logo}
                      alt={`${brand.name} ${t('official logo')}`}
                      loading="lazy"
                    />
                  )}
                </span>
                <span className="brand-card-body">
                  <strong>{brand.name}</strong>
                  <small>{tName(brand.tagline)}</small>
                  <em>
                    {local(
                      `${brand.modelCount} model${brand.modelCount === 1 ? '' : 's'} · ${brand.partsCount.toLocaleString('en-IN')} part${brand.partsCount === 1 ? '' : 's'}`,
                      `${brand.modelCount} मॉडल · ${brand.partsCount.toLocaleString('en-IN')} पार्ट्स`,
                      `${brand.modelCount} मॉडेल · ${brand.partsCount.toLocaleString('en-IN')} पार्ट्स`,
                      `${brand.modelCount} મોડેલ · ${brand.partsCount.toLocaleString('en-IN')} પાર્ટ્સ`
                    )}
                  </em>
                </span>
                <span className="brand-card-go" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
