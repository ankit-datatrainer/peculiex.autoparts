import React from 'react';
import Link from 'next/link';
import ProductForm from '../ProductForm';
import { createClient, isSupabaseConfigured } from '../../../../lib/supabase/server';

export const revalidate = 0;

export default async function NewProduct() {
  if (!isSupabaseConfigured) {
    return <div className="admin-setup"><h1>Connect Supabase to add products.</h1></div>;
  }

  const supabase = createClient();
  const [{ data: brands }, { data: categories }, { data: models }] = await Promise.all([
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('models').select('id, name, brand_id').order('name')
  ]);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <Link href="/admin/products" className="admin-back">← Products</Link>
          <h1>Add product</h1>
          <p>Create a single part. Use bulk import for many at once.</p>
        </div>
      </div>

      <ProductForm brands={brands || []} categories={categories || []} models={models || []} />
    </>
  );
}
