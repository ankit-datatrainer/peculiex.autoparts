import React from 'react';
import Header from './Header';
import { fetchProducts } from '../lib/api';
import { getBrands } from '../lib/catalog';
import { getSessionUser } from '../lib/supabase/server';

/**
 * Server wrapper around the client Header: pulls the brand list (so admin edits
 * show up in the nav) and the signed-in user, then hands them to the client.
 */
export default async function SiteHeader() {
  const [products, brands, { user, profile }] = await Promise.all([
    fetchProducts(),
    getBrands(),
    getSessionUser()
  ]);

  return (
    <Header
      products={products}
      brands={brands}
      user={user ? { email: user.email, name: profile?.full_name || '', role: profile?.role } : null}
    />
  );
}
