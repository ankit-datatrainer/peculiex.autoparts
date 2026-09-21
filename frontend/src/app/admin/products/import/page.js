import React from 'react';
import Link from 'next/link';
import ImportForm from './ImportForm';
import { getT } from '../../../../lib/i18n-server';

export const revalidate = 0;

export default function ImportPage() {
  const { t } = getT();
  return (
    <>
      <div className="admin-page-head">
        <div>
          <Link href="/admin/products" className="admin-back">← {t('Products')}</Link>
          <h1>{t('Bulk import')}</h1>
          <p>{t('Add or update many products in one go.')}</p>
        </div>
      </div>
      <ImportForm />
    </>
  );
}
