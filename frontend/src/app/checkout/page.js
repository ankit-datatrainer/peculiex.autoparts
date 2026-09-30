import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import CheckoutClient from './CheckoutClient';
import { redirect } from 'next/navigation';
import { getViewer, getPriceAccess } from '../../lib/priceAccess';

export const metadata = {
  title: 'Checkout | MotoMart India',
  description: 'Confirm your delivery address and place your order.'
};

export const revalidate = 0;

export default async function CheckoutPage({ searchParams }) {
  const [{ user, profile }, access] = await Promise.all([getViewer(), getPriceAccess()]);

  // Prices (and so the order total) are only shown to verified customers.
  if (user && !access.canSee) redirect('/verify-email?next=/checkout');

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
