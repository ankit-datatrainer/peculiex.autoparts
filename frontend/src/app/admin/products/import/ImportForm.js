'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { importProducts } from '../../actions';
import { useLanguage } from '../../../../context/LanguageContext';

const SAMPLE_CSV = `name,sku,brand_id,category_id,price,mrp,stock,vendor,images
Front Brake Pad Set,MM-BRK-001,honda,brake-pad,449,699,40,Eauto,https://example.com/pad.jpg
Clutch Cable,MM-CBL-014,bajaj,cables,199,299,120,OES,`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-primary-btn" disabled={pending}>
      {pending ? 'Importing…' : 'Import products'}
    </button>
  );
}

export default function ImportForm() {
  const { t } = useLanguage();
  const [state, action] = useFormState(importProducts, {});

  return (
    <form action={action} className="admin-card admin-import">
      <h2>{t('Paste CSV or JSON')}</h2>
      <p className="admin-hint">
        CSV needs a header row. JSON can be an array of objects. Recognised fields:{' '}
        <code>id, name, sku, brand_id, category_id, vendor, description, price, mrp, stock, images, fitment, is_active</code>.
        Separate multiple image URLs with <code>|</code>. Rows whose <code>id</code> already exists
        are updated rather than duplicated.
      </p>

      <textarea
        name="payload"
        rows={14}
        required
        placeholder={SAMPLE_CSV}
        defaultValue=""
        spellCheck={false}
      />

      {state?.error && <p className="admin-error">{state.error}</p>}
      {state?.notice && <p className="admin-notice">{state.notice}</p>}

      <div className="admin-form-actions">
        <SubmitButton />
      </div>
    </form>
  );
}
