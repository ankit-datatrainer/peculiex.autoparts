import React from 'react';
import { redirect } from 'next/navigation';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import VerifyEmailClient from './VerifyEmailClient';
import { getPriceAccess } from '../../lib/priceAccess';

export const revalidate = 0;

export const metadata = {
  title: 'Verify your email | MotoMart India',
  description: 'Verify your email with a one-time code to see prices.'
};

function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export default async function VerifyEmailPage({ searchParams }) {
  const next = safeNext(searchParams?.next);
  const access = await getPriceAccess();

  if (access.status === 'guest') {
    redirect(`/signin?next=${encodeURIComponent(`/verify-email?next=${encodeURIComponent(next)}`)}`);
  }
  if (access.canSee) redirect(next);

  return (
    <div>
      <SiteHeader />
      <main id="main">
        <VerifyEmailClient email={access.email || ''} next={next} autoSend={searchParams?.send === '1'} />
      </main>
      <Footer />
    </div>
  );
}
