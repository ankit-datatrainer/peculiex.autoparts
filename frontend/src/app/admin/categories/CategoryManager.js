'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { saveCategory, deleteCategory } from '../actions';
import { useLanguage } from '../../../context/LanguageContext';

function SaveButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-primary-btn" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  );
}

export default function CategoryManager({ categories = [], counts = {} }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [editing, setEditing] = useState(null); // null = create mode
  const [state, action] = useFormState(saveCategory, {});
  const [busy, setBusy] = useState(false);

  const remove = async (cat) => {
    if (!confirm(`Delete "${cat.name}"? Products in it become uncategorised.`)) return;
    setBusy(true);
    const res = await deleteCategory(cat.id);
    setBusy(false);
    if (res?.error) alert(res.error);
    router.refresh();
  };

  return (
    <div className="admin-two-col wide-left">
      <section className="admin-card">
        <div className="admin-card-head">
          <h2>{t('Categories')}</h2>
          <small>{categories.length} total</small>
        </div>

        {categories.length === 0 ? (
          <p className="admin-empty">{t('No categories yet. Create one on the right.')}</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('Name')}</th>
                  <th>{t('Slug')}</th>
                  <th className="right">{t('Products')}</th>
                  <th>{t('Status')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                      {c.description && <small>{c.description}</small>}
                    </td>
                    <td>
                      <code>{c.id}</code>
                    </td>
                    <td className="right">{counts[c.id] || 0}</td>
                    <td>
                      <span className={`admin-pill ${c.is_active ? 'on' : 'off'}`}>
                        {c.is_active ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="right nowrap">
                      <button
                        type="button"
                        className="admin-ghost-btn small"
                        onClick={() => setEditing(c)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-danger-btn small"
                        onClick={() => remove(c)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>{editing ? 'Edit category' : 'New category'}</h2>
          {editing && (
            <button type="button" className="admin-ghost-btn small" onClick={() => setEditing(null)}>
              New instead
            </button>
          )}
        </div>

        <form action={action} className="admin-form-stack" key={editing?.id || 'new'}>
          <input type="hidden" name="id" value={editing?.id || ''} />

          <label>
            <span>{t('Name *')}</span>
            <input name="name" defaultValue={editing?.name || ''} required />
          </label>

          <label>
            <span>{t('Description')}</span>
            <textarea name="description" rows={3} defaultValue={editing?.description || ''} />
          </label>

          <label>
            <span>{t('Image URL')}</span>
            <input name="image" defaultValue={editing?.image || ''} placeholder={t('/assets/…')} />
          </label>

          <label>
            <span>{t('Sort order')}</span>
            <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
          </label>

          <label className="admin-check">
            <input type="checkbox" name="is_active" defaultChecked={editing ? editing.is_active : true} />
            <span>{t('Visible on the storefront')}</span>
          </label>

          {state?.error && <p className="admin-error">{state.error}</p>}
          {state?.notice && <p className="admin-notice">{state.notice}</p>}

          <SaveButton label={editing ? 'Save category' : 'Create category'} />
        </form>
      </section>
    </div>
  );
}
