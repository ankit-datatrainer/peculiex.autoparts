import React from 'react';
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
  if (!brand || !meta) return { title: 'Model Not Found | MotoMart India' };
  return {
    title: `${brand.name} ${meta.name} Spare Parts | MotoMart India`,
    description: `${meta.partsCount} genuine and OEM-grade spare parts for the ${brand.name} ${meta.name}, with verified fitment and pan-India delivery.`
  };
}

export default async function ModelPartsPage({ params }) {
  const [brand, model] = await Promise.all([
    getBrand(params.brand),
    getModel(params.brand, params.model)
  ]);
  if (!brand || !model) notFound();

  const siblings = brand.models.filter((m) => m.id !== model.modelId).slice(0, 7);

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
            <Link href={`/brands/${brand.id}`}>{brand.name}</Link>
            <span aria-hidden="true">›</span>
            <strong>{model.modelName}</strong>
          </nav>

          <header className="catalog-banner model-banner">
            <div>
              <span className="catalog-chip">{model.vehicleType.toUpperCase()}</span>
              <h1>
                {brand.name.charAt(0) + brand.name.slice(1).toLowerCase()} {model.modelName} spare
                parts
              </h1>
              <ul className="catalog-facts">
                <li>{model.parts.length} parts in stock</li>
                <li>✓ 100% genuine</li>
                <li>Pan-India delivery</li>
              </ul>
            </div>
            <div className="catalog-banner-photo">
              <img src={model.image} alt={`${brand.name} ${model.modelName}`} />
              <span>{model.modelName}</span>
            </div>
          </header>

          {siblings.length > 0 && (
            <div className="sibling-row">
              <span>More {brand.name}:</span>
              {siblings.map((m) => (
                <Link key={m.id} href={`/brands/${brand.id}/${m.id}`}>
                  {m.name}
                </Link>
              ))}
              <Link className="sibling-all" href={`/brands/${brand.id}`}>
                All {brand.modelCount} models →
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
