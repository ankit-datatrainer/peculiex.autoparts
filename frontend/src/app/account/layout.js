import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { fetchProducts } from '../../lib/api';
import { getSessionUser } from '../../lib/supabase/server';
import { signOut } from '../auth/actions';
import { getT } from '../../lib/i18n-server';

export default async function AccountLayout({ children }) {
  const { t, local } = getT();
  const [products, { user, profile }] = await Promise.all([fetchProducts(), getSessionUser()]);
  const name = profile?.full_name || user?.email?.split('@')[0] || t('rider');

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell account-page">
          <header className="account-head">
            <div>
              <span className="eyebrow dark">{t('YOUR ACCOUNT')}</span>
              <h1>
                {local(`Hello, ${name}`, `नमस्ते, ${name}`, `नमस्कार, ${name}`, `નમસ્તે, ${name}`)}
              </h1>
              <p>{user?.email}</p>
            </div>
            {profile?.role === 'admin' && (
              <Link href="/admin" className="account-admin-link">
                {t('Open super admin panel')} →
              </Link>
            )}
          </header>

          <div className="account-layout">
            <nav className="account-nav" aria-label={t('Account sections')}>
              <Link href="/account">{t('Overview')}</Link>
              <Link href="/account/orders">{t('My orders')}</Link>
              <Link href="/account/profile">{t('Profile')}</Link>
              <Link href="/cart">{t('Cart')}</Link>
              <form action={signOut}>
                <button type="submit">{t('Sign out')}</button>
              </form>
            </nav>

            <div className="account-content">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
