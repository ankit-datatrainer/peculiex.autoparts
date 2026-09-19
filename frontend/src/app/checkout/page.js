import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CheckoutClient from './CheckoutClient';
import { fetchProducts } from '../../lib/api';
import { getSessionUser } from '../../lib/supabase/server';

export const metadata = {
  title: 'Checkout | MotoMart India',
  description: 'Confirm your delivery address and place your order.'
};

export default async function CheckoutPage({ searchParams }) {
  const [products, { user, profile }] = await Promise.all([fetchProducts(), getSessionUser()]);

  return (
    <div>
      <SiteHeader />
      <main id="main">
        <CheckoutClient
          profile={profile}
          email={user?.email || ''}
          notFromCart={searchParams?.notes || ''}
        />
      </main>
      <Footer />
    </div>
  );
}
