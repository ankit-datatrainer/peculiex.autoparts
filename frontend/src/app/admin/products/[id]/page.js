import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductForm from '../ProductForm';
import ImageManager from '../ImageManager';
import { createClient, isSupabaseConfigured } from '../../../../lib/supabase/server';
import { getT } from '../../../../lib/i18n-server';

export const revalidate = 0;

export default async function EditProduct({ params }) {
  const { t } = getT();
  if (!isSupabaseConfigured) notFound();

  const id = decodeURIComponent(params.id);
  const supabase = createClient();

  const [{ data: product }, { data: brands }, { data: categories }, { data: models }, { data: fits }] =
    await Promise.all([
      supabase.from('products').select('*').eq('id', id).maybeSingle(),
      supabase.from('brands').select('id, name').order('name'),
      supabase.from('categories').select('id, name').order('name'),
      supabase.from('models').select('id, name, brand_id').order('name'),
      supabase.from('product_models').select('model_id').eq('product_id', id)
    ]);

  if (!product) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <Link href="/admin/products" className="admin-back">← {t('Products')}</Link>
          <h1>{product.name}</h1>
          <p>{product.sku || product.id}</p>
        </div>
      </div>

      <ProductForm
        product={product}
        brands={brands || []}
        categories={categories || []}
        models={models || []}
        fitModelIds={(fits || []).map((f) => f.model_id)}
      />

      <ImageManager productId={product.id} images={product.images || []} />
    </>
  );
}
