import React from 'react';
import './admin.css';
import Link from 'next/link';
import AdminNav from './AdminNav';
import { getSessionUser } from '../../lib/supabase/server';
import { signOut } from '../auth/actions';

export const metadata = {
  title: 'Super Admin | MotoMart India',
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }) {
  const { user, profile } = await getSessionUser();

  return (
    <div className="admin-root">
      <header className="admin-topbar">
        <AdminNav />
        <Link href="/admin" className="admin-brand">
          <img src="/assets/site-icon.svg" alt="" width="28" height="28" />
          <span>
            MotoMart <em>Super Admin</em>
          </span>
        </Link>

        <div className="admin-topbar-right">
          <Link href="/" className="admin-view-site" target="_blank" rel="noreferrer">
            View store ↗
          </Link>
          <span className="admin-who">
            <strong>{profile?.full_name || user?.email}</strong>
            <small>{user?.email}</small>
          </span>
          <form action={signOut}>
            <button type="submit" className="admin-signout">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar" id="adminSidebar">
          <AdminNav variant="links" />
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
