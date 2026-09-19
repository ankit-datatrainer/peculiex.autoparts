import React from 'react';
import BrandManager from './BrandManager';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';

export const revalidate = 0;

export default async function AdminBrands() {
  if (!isSupabaseConfigured) {
    return <div className="admin-setup"><h1>Connect Supabase to manage brands.</h1></div>;
  }

  const supabase = createClient();
  const [{ data: brands }, { data: models }, { data: products }] = await Promise.all([
    supabase.from('brands').select('*').order('sort_order').order('name'),
    supabase.from('models').select('*').order('name'),
    supabase.from('products').select('brand_id')
  ]);

  const counts = {};
  for (const p of products || []) {
    if (p.brand_id) counts[p.brand_id] = (counts[p.brand_id] || 0) + 1;
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Brands &amp; models</h1>
          <p>Drives the brand strip, the hover menu and every /brands page.</p>
        </div>
      </div>
      <BrandManager brands={brands || []} models={models || []} counts={counts} />
    </>
  );
}
