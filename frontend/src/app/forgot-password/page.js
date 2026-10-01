import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import ForgotPasswordClient from './ForgotPasswordClient';

export const revalidate = 0;

export const metadata = {
  title: 'Forgot password | MotoMart India',
  description: 'Get a code by email and choose a new password.'
};

function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/account';
}

export default function ForgotPasswordPage({ searchParams }) {
  return (
    <div>
      <SiteHeader />
      <main id="main">
        <ForgotPasswordClient next={safeNext(searchParams?.next)} />
      </main>
      <Footer />
    </div>
  );
}
