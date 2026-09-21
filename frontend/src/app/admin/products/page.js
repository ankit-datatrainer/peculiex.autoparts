import React from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import ProductTable from './ProductTable';
import { getT } from '../../../lib/i18n-server';

export const revalidate = 0;

const PAGE_SIZE = 25;

export default async function AdminProducts({ searchParams }) {
  const { t } = getT();
  if (!isSupabaseConfigured) {
    return <div className="admin-setup"><h1>{t('Connect Supabase to manage products.')}</h1></div>;
  }

  const supabase = createClient();
  const page = Math.max(1, Number(searchParams?.page) || 1);
  const q = (searchParams?.q || '').trim();
  const brand = searchParams?.brand || '';
  const category = searchParams?.category || '';
  const stock = searchParams?.stock || '';
  const status = searchParams?.status || '';

  let query = supabase
    .from('products')
    .select('id, name, sku, price, mrp, stock, images, is_active, brand_id, category_id', {
      count: 'exact'
    });

  if (q) query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%,id.ilike.%${q}%`);
  if (brand) query = query.eq('brand_id', brand);
  if (category) query = query.eq('category_id', category);
  if (stock === 'low') query = query.lte('stock', 5);
  if (stock === 'out') query = query.eq('stock', 0);
  if (status === 'active') query = query.eq('is_active', true);
  if (status === 'hidden') query = query.eq('is_active', false);

  const from = (page - 1) * PAGE_SIZE;

  const [{ data: products, count, error }, { data: brands }, { data: categories }] =
    await Promise.all([
      query.order('name').range(from, from + PAGE_SIZE - 1),
      supabase.from('brands').select('id, name').order('name'),
      supabase.from('categories').select('id, name').order('name')
    ]);

  const total = count || 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{t('Products')}</h1>
          <p>{total.toLocaleString('en-IN')} in the catalog</p>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/products/import" className="admin-ghost-btn">
            Bulk import
          </Link>
          <Link href="/admin/products/new" className="admin-primary-btn">
            + Add product
          </Link>
        </div>
      </div>

      <form className="admin-filters" method="get">
        <input name="q" defaultValue={q} placeholder={t('Search name, SKU or id')} aria-label={t('Search products')} />
        <select name="brand" defaultValue={brand} aria-label={t('Filter by brand')}>
          <option value="">{t('All brands')}</option>
          {(brands || []).map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select name="category" defaultValue={category} aria-label={t('Filter by category')}>
          <option value="">{t('All categories')}</option>
          {(categories || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="stock" defaultValue={stock} aria-label={t('Filter by stock')}>
          <option value="">{t('Any stock')}</option>
          <option value="low">{t('Low (≤5)')}</option>
          <option value="out">{t('Out of stock')}</option>
        </select>
        <select name="status" defaultValue={status} aria-label={t('Filter by status')}>
          <option value="">{t('Any status')}</option>
          <option value="active">{t('Live')}</option>
          <option value="hidden">{t('Hidden')}</option>
        </select>
        <button type="submit" className="admin-primary-btn">
          Filter
        </button>
        <Link href="/admin/products" className="admin-ghost-btn">
          Reset
        </Link>
      </form>

      {error ? (
        <p className="admin-error">{error.message}</p>
      ) : (
        <ProductTable products={products || []} />
      )}

      {pages > 1 && (
        <nav className="admin-pager" aria-label={t('Pagination')}>
          {page > 1 && (
            <Link href={{ pathname: '/admin/products', query: { ...searchParams, page: page - 1 } }}>
              ← Previous
            </Link>
          )}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link href={{ pathname: '/admin/products', query: { ...searchParams, page: page + 1 } }}>
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
