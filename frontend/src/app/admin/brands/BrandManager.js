'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { saveBrand, saveModel, deleteModel } from '../actions';
import { useLanguage } from '../../../context/LanguageContext';

function SaveButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-primary-btn" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  );
}

export default function BrandManager({ brands = [], models = [], counts = {} }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [openBrand, setOpenBrand] = useState(brands[0]?.id || null);
  const [editBrand, setEditBrand] = useState(null);
  const [editModel, setEditModel] = useState(null);
  const [busy, setBusy] = useState(false);

  const [brandState, brandAction] = useFormState(saveBrand, {});
  const [modelState, modelAction] = useFormState(saveModel, {});

  const brandModels = models.filter((m) => m.brand_id === openBrand);

  const removeModel = async (m) => {
    if (!confirm(`Delete model "${m.name}"? Its fitment links are removed too.`)) return;
    setBusy(true);
    const res = await deleteModel(m.id);
    setBusy(false);
    if (res?.error) alert(res.error);
    router.refresh();
  };

  return (
    <div className="admin-two-col wide-left">
      <section className="admin-card">
        <div className="admin-card-head">
          <h2>{t('Brands')}</h2>
          <small>{brands.length} total</small>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('Brand')}</th>
                <th className="right">{t('Models')}</th>
                <th className="right">{t('Products')}</th>
                <th>{t('Status')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className={openBrand === b.id ? 'selected' : ''}>
                  <td>
                    <div className="admin-prod-cell">
                      {b.logo && <img src={b.logo} alt="" />}
                      <div>
                        <strong>{b.name}</strong>
                        <small>{b.tagline || b.id}</small>
                      </div>
                    </div>
                  </td>
                  <td className="right">{models.filter((m) => m.brand_id === b.id).length}</td>
                  <td className="right">{counts[b.id] || 0}</td>
                  <td>
                    <span className={`admin-pill ${b.is_active ? 'on' : 'off'}`}>
                      {b.is_active ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="right nowrap">
                    <button
                      type="button"
                      className="admin-ghost-btn small"
                      onClick={() => setOpenBrand(b.id)}
                    >
                      Models
                    </button>
                    <button
                      type="button"
                      className="admin-ghost-btn small"
                      onClick={() => setEditBrand(b)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {openBrand && (
          <>
            <div className="admin-card-head spaced">
              <h2>{brands.find((b) => b.id === openBrand)?.name} models</h2>
              <button
                type="button"
                className="admin-ghost-btn small"
                onClick={() => setEditModel({ brand_id: openBrand })}
              >
                + Add model
              </button>
            </div>

            {brandModels.length === 0 ? (
              <p className="admin-empty">{t('No models for this brand yet.')}</p>
            ) : (
              <ul className="admin-model-list">
                {brandModels.map((m) => (
                  <li key={m.id}>
                    <div>
                      <strong>{m.name}</strong>
                      <small>
                        /{m.slug} · {m.type}
                      </small>
                    </div>
                    <div className="nowrap">
                      <button
                        type="button"
                        className="admin-ghost-btn small"
                        onClick={() => setEditModel(m)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-danger-btn small"
                        onClick={() => removeModel(m)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <div className="admin-side-stack">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>{editBrand ? 'Edit brand' : 'New brand'}</h2>
            {editBrand && (
              <button type="button" className="admin-ghost-btn small" onClick={() => setEditBrand(null)}>
                New instead
              </button>
            )}
          </div>

          <form action={brandAction} className="admin-form-stack" key={`b-${editBrand?.id || 'new'}`}>
            <input type="hidden" name="id" value={editBrand?.id || ''} />
            <label>
              <span>{t('Name *')}</span>
              <input name="name" defaultValue={editBrand?.name || ''} required />
            </label>
            <label>
              <span>{t('Tagline')}</span>
              <input name="tagline" defaultValue={editBrand?.tagline || ''} />
            </label>
            <label>
              <span>{t('Logo URL')}</span>
              <input name="logo" defaultValue={editBrand?.logo || ''} />
            </label>
            <label>
              <span>{t('Hero image URL')}</span>
              <input name="hero_image" defaultValue={editBrand?.hero_image || ''} />
            </label>
            <label>
              <span>{t('Sort order')}</span>
              <input name="sort_order" type="number" defaultValue={editBrand?.sort_order ?? 0} />
            </label>
            <label className="admin-check">
              <input type="checkbox" name="is_active" defaultChecked={editBrand ? editBrand.is_active : true} />
              <span>{t('Visible on the storefront')}</span>
            </label>

            {brandState?.error && <p className="admin-error">{brandState.error}</p>}
            {brandState?.notice && <p className="admin-notice">{brandState.notice}</p>}

            <SaveButton label={editBrand ? 'Save brand' : 'Create brand'} />
          </form>
        </section>

        {editModel && (
          <section className="admin-card">
            <div className="admin-card-head">
              <h2>{editModel.id ? 'Edit model' : 'New model'}</h2>
              <button type="button" className="admin-ghost-btn small" onClick={() => setEditModel(null)}>
                Close
              </button>
            </div>

            <form action={modelAction} className="admin-form-stack" key={`m-${editModel.id || 'new'}`}>
              <input type="hidden" name="id" value={editModel.id || ''} />
              <label>
                <span>{t('Brand *')}</span>
                <select name="brand_id" defaultValue={editModel.brand_id || openBrand} required>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t('Model name *')}</span>
                <input name="name" defaultValue={editModel.name || ''} required />
              </label>
              <label>
                <span>{t('URL slug')}</span>
                <input name="slug" defaultValue={editModel.slug || ''} placeholder={t('auto from name')} />
              </label>
              <label>
                <span>{t('Type')}</span>
                <select name="type" defaultValue={editModel.type || 'bike'}>
                  <option value="bike">{t('Bike')}</option>
                  <option value="scooter">{t('Scooter')}</option>
                </select>
              </label>
              <label>
                <span>{t('Vehicle type label')}</span>
                <input name="vehicle_type" defaultValue={editModel.vehicle_type || 'Motorcycle'} />
              </label>
              <label>
                <span>{t('Image URL')}</span>
                <input name="image" defaultValue={editModel.image || ''} />
              </label>
              <label className="admin-check">
                <input type="checkbox" name="is_active" defaultChecked={editModel.id ? editModel.is_active : true} />
                <span>{t('Visible on the storefront')}</span>
              </label>

              {modelState?.error && <p className="admin-error">{modelState.error}</p>}
              {modelState?.notice && <p className="admin-notice">{modelState.notice}</p>}

              <SaveButton label={editModel.id ? 'Save model' : 'Create model'} />
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
