import React from 'react';
import { getT } from '../../../../lib/i18n-server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../../components/SiteHeader';
import Footer from '../../../../components/Footer';
import ModelPartsClient from './ModelPartsClient';
import { getBrand, getModel } from '../../../../lib/catalog';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const brand = await getBrand(params.brand);
  const meta = brand?.models.find((m) => m.id === params.model);
  const { t, local } = getT();
  if (!brand || !meta) return { title: `${t('Model not found')} | MotoMart India` };

  const vehicle = `${brand.name} ${meta.name}`;
  return {
    title: `${vehicle} ${t('Spare Parts')} | MotoMart India`,
    description: local(
      `${meta.partsCount} genuine and OEM-grade spare parts for the ${vehicle}, with verified fitment and pan-India delivery.`,
      `${vehicle} के लिए ${meta.partsCount} असली और OEM-ग्रेड स्पेयर पार्ट्स — जाँचा हुआ फ़िटमेंट, पूरे भारत में डिलीवरी।`,
      `${vehicle} साठी ${meta.partsCount} अस्सल आणि OEM-ग्रेड स्पेअर पार्ट्स — तपासलेले फिटमेंट, संपूर्ण भारतात डिलिव्हरी.`,
      `${vehicle} માટે ${meta.partsCount} અસલી અને OEM-ગ્રેડ સ્પેર પાર્ટ્સ — ચકાસેલું ફિટમેન્ટ, સમગ્ર ભારતમાં ડિલિવરી.`
    )
  };
}

export default async function ModelPartsPage({ params }) {
  const [brand, model] = await Promise.all([
    getBrand(params.brand),
    getModel(params.brand, params.model)
  ]);
  if (!brand || !model) notFound();

  const { t, local } = getT();
  const siblings = brand.models.filter((m) => m.id !== model.modelId).slice(0, 7);
  const brandLabel = brand.name.charAt(0) + brand.name.slice(1).toLowerCase();

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
            <Link href={`/brands/${brand.id}`}>{brand.name}</Link>
            <span aria-hidden="true">›</span>
            <strong>{model.modelName}</strong>
          </nav>

          <header className="catalog-banner model-banner">
            <div>
              <span className="catalog-chip">
                {t(model.vehicleType === 'scooter' ? 'Scooter' : 'Motorcycle')}
              </span>
              <h1>
                {local(
                  `${brandLabel} ${model.modelName} spare parts`,
                  `${brandLabel} ${model.modelName} स्पेयर पार्ट्स`,
                  `${brandLabel} ${model.modelName} स्पेअर पार्ट्स`,
                  `${brandLabel} ${model.modelName} સ્પેર પાર્ટ્સ`
                )}
              </h1>
              <ul className="catalog-facts">
                <li>
                  {local(
                    `${model.parts.length} parts in stock`,
                    `${model.parts.length} पार्ट्स स्टॉक में`,
                    `${model.parts.length} पार्ट्स स्टॉकमध्ये`,
                    `${model.parts.length} પાર્ટ્સ સ્ટોકમાં`
                  )}
                </li>
                <li>✓ {t('100% genuine')}</li>
                <li>{t('Pan-India delivery')}</li>
              </ul>
            </div>
            <div className="catalog-banner-photo">
              <img src={model.image} alt={`${brand.name} ${model.modelName}`} />
              <span>{model.modelName}</span>
            </div>
          </header>

          {siblings.length > 0 && (
            <div className="sibling-row">
              <span>
                {local(
                  `More ${brand.name}:`,
                  `और ${brand.name}:`,
                  `आणखी ${brand.name}:`,
                  `વધુ ${brand.name}:`
                )}
              </span>
              {siblings.map((m) => (
                <Link key={m.id} href={`/brands/${brand.id}/${m.id}`}>
                  {m.name}
                </Link>
              ))}
              <Link className="sibling-all" href={`/brands/${brand.id}`}>
                {local(
                  `All ${brand.modelCount} models`,
                  `सभी ${brand.modelCount} मॉडल`,
                  `सर्व ${brand.modelCount} मॉडेल`,
                  `બધા ${brand.modelCount} મોડેલ`
                )}{' '}
                →
              </Link>
            </div>
          )}

          <ModelPartsClient model={model} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
