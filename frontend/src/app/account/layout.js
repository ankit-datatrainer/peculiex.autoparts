import React from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { fetchProducts } from '../../lib/api';
import { getSessionUser } from '../../lib/supabase/server';
import { signOut } from '../auth/actions';

export default async function AccountLayout({ children }) {
  const [products, { user, profile }] = await Promise.all([fetchProducts(), getSessionUser()]);

  return (
    <div>
      <SiteHeader />

      <main id="main">
        <div className="page-shell account-page">
          <header className="account-head">
            <div>
              <span className="eyebrow dark">YOUR ACCOUNT</span>
              <h1>Hello, {profile?.full_name || user?.email?.split('@')[0] || 'rider'}</h1>
              <p>{user?.email}</p>
            </div>
            {profile?.role === 'admin' && (
              <Link href="/admin" className="account-admin-link">
                Open super admin panel →
              </Link>
            )}
          </header>

          <div className="account-layout">
            <nav className="account-nav" aria-label="Account sections">
              <Link href="/account">Overview</Link>
              <Link href="/account/orders">My orders</Link>
              <Link href="/account/profile">Profile</Link>
              <Link href="/cart">Cart</Link>
              <form action={signOut}>
                <button type="submit">Sign out</button>
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
