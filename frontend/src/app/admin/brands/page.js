import React from 'react';
import BrandManager from './BrandManager';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import { getCatalogCounts } from '../../../lib/catalog';
import { getT } from '../../../lib/i18n-server';

export const revalidate = 0;

export default async function AdminBrands() {
  const { t } = getT();
  if (!isSupabaseConfigured) {
    return <div className="admin-setup"><h1>{t('Connect Supabase to manage brands.')}</h1></div>;
  }

  const supabase = createClient();
  const [{ data: brands }, { data: models }, catalogCounts] = await Promise.all([
    supabase.from('brands').select('*').order('sort_order').order('name'),
    supabase.from('models').select('*').order('name'),
    getCatalogCounts()
  ]);

  const counts = catalogCounts.brands;

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{t('Brands & models')}</h1>
          <p>{t('Drives the brand strip, the hover menu and every /brands page.')}</p>
        </div>
      </div>
      <BrandManager brands={brands || []} models={models || []} counts={counts} />
    </>
  );
}
