import React from 'react';
import CategoryManager from './CategoryManager';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';

export const revalidate = 0;

export default async function AdminCategories() {
  if (!isSupabaseConfigured) {
    return <div className="admin-setup"><h1>Connect Supabase to manage categories.</h1></div>;
  }

  const supabase = createClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order').order('name'),
    supabase.from('products').select('category_id')
  ]);

  const counts = {};
  for (const p of products || []) {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Categories</h1>
          <p>Part categories used across the storefront filters.</p>
        </div>
      </div>
      <CategoryManager categories={categories || []} counts={counts} />
    </>
  );
}
