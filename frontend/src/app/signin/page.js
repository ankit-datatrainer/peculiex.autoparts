import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import AuthForm from './AuthForm';
import { fetchProducts } from '../../lib/api';

export const metadata = {
  title: 'Sign in | MotoMart India',
  description: 'Sign in to track your orders and check out faster.'
};

export default async function SignInPage({ searchParams }) {
  const products = await fetchProducts();
  return (
    <div>
      <SiteHeader />
      <main id="main">
        <AuthForm mode="signin" next={searchParams?.next || '/account'} />
      </main>
      <Footer />
    </div>
  );
}
