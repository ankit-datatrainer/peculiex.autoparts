import React from 'react';
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
  return (
    <div className="model-grid">
      {models.map((model) => (
        <Link key={model.id} href={`/brands/${brandId}/${model.id}`} className="model-card">
          <span className="model-card-media">
            <img src={model.image} alt={`${model.name} spare parts`} loading="lazy" />
          </span>
          <span className="model-card-body">
            <strong>{model.name}</strong>
            <small>{model.partsCount} parts available</small>
            {model.topCategories.length > 0 && <em>{model.topCategories.join(' · ')}</em>}
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

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell catalog-page">
          <nav className="catalog-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/brands">Bike Brands</Link>
            <span aria-hidden="true">›</span>
            <strong>{brand.name}</strong>
          </nav>

          <header className="catalog-banner">
            <div>
              <span className="catalog-chip">{brand.name} · GENUINE &amp; OEM-GRADE</span>
              <h1>{brand.name} spare parts</h1>
              <p>
                Choose your {brand.name} model to see every part that fits it — engine, brakes,
                electricals, body and more.
              </p>
              <ul className="catalog-facts">
                <li>{brand.modelCount} models</li>
                <li>{brand.partsCount.toLocaleString('en-IN')} parts in stock</li>
                <li>Pan-India delivery</li>
              </ul>
            </div>
            {brand.logo && (
              <div className="catalog-banner-logo">
                <img src={brand.logo} alt={`${brand.name} logo`} />
              </div>
            )}
          </header>

          {bikes.length > 0 && (
            <section className="catalog-block">
              <div className="catalog-block-head">
                <h2>{brand.name} bikes</h2>
                <small>{bikes.length} models</small>
              </div>
              <ModelGrid brandId={brand.id} models={bikes} />
            </section>
          )}

          {scooters.length > 0 && (
            <section className="catalog-block">
              <div className="catalog-block-head">
                <h2>{brand.name} scooters</h2>
                <small>{scooters.length} models</small>
              </div>
              <ModelGrid brandId={brand.id} models={scooters} />
            </section>
          )}

          <section className="catalog-block">
            <div className="catalog-block-head">
              <h2>Other brands</h2>
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
