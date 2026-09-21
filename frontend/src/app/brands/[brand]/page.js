import React from 'react';
import { getT } from '../../../lib/i18n-server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import Footer from '../../../components/Footer';
import { getBrand, getBrands } from '../../../lib/catalog';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const brand = await getBrand(params.brand);
  if (!brand) return { title: 'Brand Not Found | MotoMart India' };
  return {
    title: `${brand.name} Bike & Scooter Spare Parts | MotoMart India`,
    description: `Browse ${brand.modelCount} ${brand.name} models and ${brand.partsCount} genuine spare parts with verified fitment.`
  };
}

function ModelGrid({ brandId, models }) {
  const { t, tCat, local } = getT();

  return (
    <div className="model-grid">
      {models.map((model) => (
        <Link key={model.id} href={`/brands/${brandId}/${model.id}`} className="model-card">
          <span className="model-card-media">
            <img
              src={model.image}
              alt={`${model.name} ${t('Spare Parts')}`}
              loading="lazy"
            />
          </span>
          <span className="model-card-body">
            <strong>{model.name}</strong>
            <small>
              {local(
                `${model.partsCount} parts available`,
                `${model.partsCount} पार्ट्स उपलब्ध`,
                `${model.partsCount} पार्ट्स उपलब्ध`,
                `${model.partsCount} પાર્ટ્સ ઉપલબ્ધ`
              )}
            </small>
            {model.topCategories.length > 0 && (
              <em>{model.topCategories.map((c) => tCat(c)).join(' · ')}</em>
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default async function BrandModelsPage({ params }) {
  const [brand, allBrands] = await Promise.all([getBrand(params.brand), getBrands()]);
  if (!brand) notFound();

  const bikes = brand.models.filter((m) => m.type === 'bike');
  const scooters = brand.models.filter((m) => m.type === 'scooter');

  const { t, local } = getT();

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell catalog-page">
          <nav className="catalog-crumbs" aria-label={t('Breadcrumb')}>
            <Link href="/">{t('Home')}</Link>
            <span aria-hidden="true">›</span>
            <Link href="/brands">{t('Bike Brands')}</Link>
            <span aria-hidden="true">›</span>
            <strong>{brand.name}</strong>
          </nav>

          <header className="catalog-banner">
            <div>
              <span className="catalog-chip">
                {brand.name} · {t('GENUINE & OEM-GRADE')}
              </span>
              <h1>
                {local(
                  `${brand.name} spare parts`,
                  `${brand.name} स्पेयर पार्ट्स`,
                  `${brand.name} स्पेअर पार्ट्स`,
                  `${brand.name} સ્પેર પાર્ટ્સ`
                )}
              </h1>
              <p>
                {local(
                  `Choose your ${brand.name} model to see every part that fits it — engine, brakes, electricals, body and more.`,
                  `अपना ${brand.name} मॉडल चुनें और उसमें फ़िट होने वाला हर पार्ट देखें — इंजन, ब्रेक, इलेक्ट्रिकल्स, बॉडी और बहुत कुछ।`,
                  `तुमचे ${brand.name} मॉडेल निवडा आणि त्यात बसणारा प्रत्येक पार्ट पाहा — इंजिन, ब्रेक, इलेक्ट्रिकल्स, बॉडी आणि बरेच काही.`,
                  `તમારું ${brand.name} મોડેલ પસંદ કરો અને તેમાં ફિટ થતો દરેક પાર્ટ જુઓ — એન્જિન, બ્રેક, ઇલેક્ટ્રિકલ્સ, બોડી અને ઘણું બધું.`
                )}
              </p>
              <ul className="catalog-facts">
                <li>
                  {local(
                    `${brand.modelCount} models`,
                    `${brand.modelCount} मॉडल`,
                    `${brand.modelCount} मॉडेल`,
                    `${brand.modelCount} મોડેલ`
                  )}
                </li>
                <li>
                  {local(
                    `${brand.partsCount.toLocaleString('en-IN')} parts in stock`,
                    `${brand.partsCount.toLocaleString('en-IN')} पार्ट्स स्टॉक में`,
                    `${brand.partsCount.toLocaleString('en-IN')} पार्ट्स स्टॉकमध्ये`,
                    `${brand.partsCount.toLocaleString('en-IN')} પાર્ટ્સ સ્ટોકમાં`
                  )}
                </li>
                <li>{t('Pan-India delivery')}</li>
              </ul>
            </div>
            {brand.logo && (
              <div className="catalog-banner-logo">
                <img src={brand.logo} alt={`${brand.name} ${t('official logo')}`} />
              </div>
            )}
          </header>

          {bikes.length > 0 && (
            <section className="catalog-block">
              <div className="catalog-block-head">
                <h2>
                  {local(
                    `${brand.name} bikes`,
                    `${brand.name} बाइक`,
                    `${brand.name} बाइक`,
                    `${brand.name} બાઇક`
                  )}
                </h2>
                <small>
                  {local(
                    `${bikes.length} models`,
                    `${bikes.length} मॉडल`,
                    `${bikes.length} मॉडेल`,
                    `${bikes.length} મોડેલ`
                  )}
                </small>
              </div>
              <ModelGrid brandId={brand.id} models={bikes} />
            </section>
          )}

          {scooters.length > 0 && (
            <section className="catalog-block">
              <div className="catalog-block-head">
                <h2>
                  {local(
                    `${brand.name} scooters`,
                    `${brand.name} स्कूटर`,
                    `${brand.name} स्कूटर`,
                    `${brand.name} સ્કૂટર`
                  )}
                </h2>
                <small>
                  {local(
                    `${scooters.length} models`,
                    `${scooters.length} मॉडल`,
                    `${scooters.length} मॉडेल`,
                    `${scooters.length} મોડેલ`
                  )}
                </small>
              </div>
              <ModelGrid brandId={brand.id} models={scooters} />
            </section>
          )}

          <section className="catalog-block">
            <div className="catalog-block-head">
              <h2>{t('Other brands')}</h2>
            </div>
            <div className="brand-pill-row">
              {allBrands
                .filter((b) => b.id !== brand.id)
                .map((b) => (
                  <Link key={b.id} href={`/brands/${b.id}`} className="brand-pill">
                    {b.name}
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
