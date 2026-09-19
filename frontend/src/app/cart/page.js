import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CartPageClient from './CartPageClient';
import { fetchProducts } from '../../lib/api';
import { getStoreSettings } from '../../lib/catalog';

export const revalidate = 0;

export const metadata = {
  title: 'Shopping Cart | MotoMart India',
  description: 'Review your selected bike and scooter parts.'
};

export default async function CartPage() {
  const [products, settings] = await Promise.all([fetchProducts(), getStoreSettings()]);

  return (
    <div>
      <SiteHeader />
      <main id="main">
        <CartPageClient products={products} storeNotice={settings.cartNotice} />
      </main>
      <Footer />
    </div>
  );
}
