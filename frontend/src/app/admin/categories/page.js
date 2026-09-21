import React from 'react';
import CategoryManager from './CategoryManager';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import { getCatalogCounts } from '../../../lib/catalog';
import { getT } from '../../../lib/i18n-server';

export const revalidate = 0;

export default async function AdminCategories() {
  const { t } = getT();
  if (!isSupabaseConfigured) {
    return <div className="admin-setup"><h1>{t('Connect Supabase to manage categories.')}</h1></div>;
  }

  const supabase = createClient();
  const [{ data: categories }, catalogCounts] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order').order('name'),
    getCatalogCounts()
  ]);

  const counts = catalogCounts.categories;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{t('Categories')}</h1>
          <p>{t('Part categories used across the storefront filters.')}</p>
        </div>
      </div>
      <CategoryManager categories={categories || []} counts={counts} />
    </>
  );
}
