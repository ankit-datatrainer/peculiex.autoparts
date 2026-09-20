import React from 'react';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import Footer from '../../../components/Footer';
import ProductDetailClient from './ProductDetailClient';
import { fetchProductById, fetchProducts } from '../../../lib/api';
import { getProductById, getRelatedProducts, usingDatabase } from '../../../lib/catalog';
import { getBrand as getJsonBrand } from '../../../lib/eautoCatalog';

export const revalidate = 0;

/**
 * Looks in the spares catalog first (the database once configured, the bundled
 * JSON before that), then falls back to the curated product feed.
 */
async function resolveProduct(id) {
  const product = await getProductById(id);
  if (product) {
    return { product, related: await getRelatedProducts(product, 6) };
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
  if (!product) return { title: 'Product Not Found | MotoMart' };
  return {
    title: `${product.name} | MotoMart India`,
    description: product.about?.[0] || product.description || product.name
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
