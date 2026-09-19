import React from 'react';
import Link from 'next/link';
import ImportForm from './ImportForm';

export const revalidate = 0;

export default function ImportPage() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <Link href="/admin/products" className="admin-back">← Products</Link>
          <h1>Bulk import</h1>
          <p>Add or update many products in one go.</p>
        </div>
      </div>
      <ImportForm />
    </>
  );
}
