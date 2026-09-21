'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { bulkProductAction } from '../actions';
import { formatCurrency } from '../../../lib/translations';
import { useLanguage } from '../../../context/LanguageContext';

function BulkButton({ op, label, danger }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="op"
      value={op}
      disabled={pending}
      className={danger ? 'admin-danger-btn' : 'admin-ghost-btn'}
    >
      {label}
    </button>
  );
}

export default function ProductTable({ products }) {
  const { t, local } = useLanguage();
  const [selected, setSelected] = useState(() => new Set());
  const [state, action] = useFormState(bulkProductAction, {});

  const allChecked = products.length > 0 && selected.size === products.length;

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allChecked ? new Set() : new Set(products.map((p) => p.id)));

  if (!products.length) {
    return <p className="admin-empty">{t('No products match these filters.')}</p>;
  }

  return (
    <form action={action}>
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="ids" value={id} />
      ))}

      {selected.size > 0 && (
        <div className="admin-bulkbar">
          <strong>
            {local(
              `${selected.size} selected`,
              `${selected.size} चुने गए`,
              `${selected.size} निवडले`,
              `${selected.size} પસંદ કરેલા`
            )}
          </strong>
          <BulkButton op="publish" label={t('Publish')} />
          <BulkButton op="hide" label={t('Hide')} />
          <label className="admin-bulk-stock">
            {t('Set stock')}
            <input name="stock" type="number" min="0" defaultValue={25} />
          </label>
          <BulkButton op="restock" label={t('Apply stock')} />
          <BulkButton op="delete" label={t('Delete')} danger />
          <button type="button" className="admin-ghost-btn" onClick={() => setSelected(new Set())}>
            {t('Clear')}
          </button>
        </div>
      )}

      {state?.error && <p className="admin-error">{state.error}</p>}
      {state?.notice && <p className="admin-notice">{state.notice}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table products">
          <thead>
            <tr>
              <th className="tick">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  aria-label={t('Select all products on this page')}
                />
              </th>
              <th>{t('Product')}</th>
              <th>{t('Brand')}</th>
              <th className="right">{t('Price')}</th>
              <th className="right">{t('Stock')}</th>
              <th>{t('Status')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={selected.has(p.id) ? 'selected' : ''}>
                <td className="tick">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                    aria-label={`Select ${p.name}`}
                  />
                </td>
                <td>
                  <div className="admin-prod-cell">
                    <img src={p.images?.[0] || '/assets/site-icon.svg'} alt="" />
                    <div>
                      <Link href={`/admin/products/${encodeURIComponent(p.id)}`}>{p.name}</Link>
                      <small>{p.sku || p.id}</small>
                    </div>
                  </div>
                </td>
                <td>{p.brand_id || '—'}</td>
                <td className="right">
                  {formatCurrency(p.price)}
                  {p.mrp > p.price && <small className="strike">{formatCurrency(p.mrp)}</small>}
                </td>
                <td className="right">
                  <span className={p.stock === 0 ? 'stock-out' : p.stock <= 5 ? 'stock-low' : ''}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <span className={`admin-pill ${p.is_active ? 'on' : 'off'}`}>
                    {p.is_active ? 'Live' : 'Hidden'}
                  </span>
                </td>
                <td className="right">
                  <Link
                    href={`/admin/products/${encodeURIComponent(p.id)}`}
                    className="admin-ghost-btn small"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
