import React from 'react';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import Footer from '../../../components/Footer';
import ProductDetailClient from './ProductDetailClient';
import { fetchProductById, fetchProducts } from '../../../lib/api';
import { getProductById, usingDatabase } from '../../../lib/catalog';
import { getRecommendationsForProduct } from '../../../lib/recommendations';
import { getBrand as getJsonBrand } from '../../../lib/eautoCatalog';
import { getT, getLanguage } from '../../../lib/i18n-server';
import { aboutBullets } from '../../../lib/productCopy';

export const revalidate = 0;

/**
 * Looks in the spares catalog first (the database once configured, the bundled
 * JSON before that), then falls back to the curated product feed.
 */
async function resolveProduct(id) {
  const product = await getProductById(id);
  if (product) {
    return { product, related: await getRecommendationsForProduct(product, 8) };
  }

  const legacy = await fetchProductById(id);
  if (!legacy) return { product: null, related: null };

  // Give curated products a breadcrumb into their brand page when one exists.
  const brand = getJsonBrand(legacy.brand);
  return { product: brand ? { ...legacy, brandId: brand.id } : legacy, related: null };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = decodeURIComponent(resolvedParams?.id || '');
  const { product } = await resolveProduct(id);
  const { t, tName } = getT();
  if (!product) return { title: `${t('Product not found')} | MotoMart` };

  const name = tName(product.name, product.category);
  return {
    title: `${name} | MotoMart India`,
    description: aboutBullets(product, getLanguage())[0] || name
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = decodeURIComponent(resolvedParams?.id || '');
  const [{ product, related }, allProducts] = await Promise.all([
    resolveProduct(id),
    fetchProducts()
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts =
    (related && related.length > 0)
      ? related
      : (allProducts || [])
          .filter((x) => x.category === product.category && x.id !== product.id)
          .concat((allProducts || []).filter((x) => x.id !== product.id))
          .slice(0, 6);

  return (
    <div>
      <SiteHeader />
      <main id="main">
        <ProductDetailClient product={product} related={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
