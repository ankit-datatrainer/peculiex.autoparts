import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import AuthForm from '../signin/AuthForm';
import { fetchProducts } from '../../lib/api';

export const metadata = {
  title: 'Create account | MotoMart India',
  description: 'Create a MotoMart account to place and track orders.'
};

export default async function SignUpPage({ searchParams }) {
  const products = await fetchProducts();
  return (
    <div>
      <SiteHeader />
      <main id="main">
        <AuthForm mode="signup" next={searchParams?.next || '/account'} />
      </main>
      <Footer />
    </div>
  );
}
