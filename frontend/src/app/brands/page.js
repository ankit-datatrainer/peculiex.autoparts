import React from 'react';
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

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell catalog-page">
          <nav className="catalog-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <strong>Bike Brands</strong>
          </nav>

          <header className="catalog-head">
            <span className="eyebrow dark">SPARES BY BIKE</span>
            <h1>Shop spare parts by brand</h1>
            <p>
              {brands.length} manufacturers · {totalModels} models ·{' '}
              {totalParts.toLocaleString('en-IN')} genuine &amp; OEM-grade parts. Choose a
              brand to see its bikes and scooters.
            </p>
          </header>

          <div className="brand-grid">
            {brands.map((brand) => (
              <Link key={brand.id} href={`/brands/${brand.id}`} className="brand-card">
                <span className="brand-card-media">
                  <img src={brand.heroImage} alt={`${brand.name} spare parts`} loading="lazy" />
                  {brand.logo && brand.logo !== brand.heroImage && (
                    <img className="brand-card-logo" src={brand.logo} alt={`${brand.name} logo`} loading="lazy" />
                  )}
                </span>
                <span className="brand-card-body">
                  <strong>{brand.name}</strong>
                  <small>{brand.tagline}</small>
                  <em>
                    {brand.modelCount} model{brand.modelCount === 1 ? '' : 's'} ·{' '}
                    {brand.partsCount.toLocaleString('en-IN')} part
                    {brand.partsCount === 1 ? '' : 's'}
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
