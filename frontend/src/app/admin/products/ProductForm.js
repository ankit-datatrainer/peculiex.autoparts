'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { saveProduct, deleteProduct, setProductActive, suggestReferenceNo } from '../actions';
import { useLanguage } from '../../../context/LanguageContext';
import { useStore } from '../../../context/StoreContext';

function SaveButton({ isNew }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-primary-btn" disabled={pending}>
      {pending ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
    </button>
  );
}

export default function ProductForm({
  product = null,
  brands = [],
  categories = [],
  models = [],
  fitModelIds = []
}) {
  const { t } = useLanguage();
  const { gstRate: storeGst, defaultMoq } = useStore();
  const router = useRouter();
  const isNew = !product;
  const [refNo, setRefNo] = useState(product?.reference_no || '');
  const [refBusy, setRefBusy] = useState(false);

  const generateRef = async () => {
    setRefBusy(true);
    const res = await suggestReferenceNo();
    setRefBusy(false);
    if (res?.error) alert(res.error);
    else if (res?.referenceNo) setRefNo(res.referenceNo);
  };
  const [state, action] = useFormState(saveProduct, {});
  const [brandId, setBrandId] = useState(product?.brand_id || '');
  const [fits, setFits] = useState(() => new Set(fitModelIds));
  const [busy, setBusy] = useState(false);

  const brandModels = models.filter((m) => m.brand_id === brandId);

  const toggleFit = (id) =>
    setFits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const onDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusy(true);
    const res = await deleteProduct(product.id);
    setBusy(false);
    if (res?.error) alert(res.error);
    else router.push('/admin/products');
  };

  const onToggleActive = async () => {
    setBusy(true);
    await setProductActive(product.id, !product.is_active);
    setBusy(false);
    router.refresh();
  };

  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="is_new" value={isNew ? '1' : '0'} />
      <input type="hidden" name="sync_models" value="1" />
      {[...fits].map((id) => (
        <input key={id} type="hidden" name="model_ids" value={id} />
      ))}

      {state?.error && <p className="admin-error">{state.error}</p>}
      {state?.notice && <p className="admin-notice">{state.notice}</p>}

      <div className="admin-form-grid">
        <section className="admin-card">
          <h2>{t('Details')}</h2>

          <label>
            <span>{t('Product name *')}</span>
            <input name="name" defaultValue={product?.name || ''} required />
          </label>

          <div className="admin-form-row">
            <label>
              <span>{t('Reference No.')}</span>
              <div className="admin-inline">
                <input
                  name="reference_no"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value.toUpperCase())}
                  placeholder={isNew ? t('Auto-generated when saved') : ''}
                  maxLength={40}
                />
                <button type="button" className="admin-ghost-btn small" onClick={generateRef} disabled={refBusy}>
                  {t('Generate')}
                </button>
              </div>
              <small className="admin-hint">{t('Shown on the product page. Must be unique.')}</small>
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              <span>Product id {isNew && <em>{t('(optional)')}</em>}</span>
              <input
                name="id"
                defaultValue={product?.id || ''}
                readOnly={!isNew}
                placeholder={isNew ? 'auto-generated' : ''}
              />
            </label>
            <label>
              <span>{t('SKU / part number')}</span>
              <input name="sku" defaultValue={product?.sku || ''} />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              <span>{t('Brand')}</span>
              <select name="brand_id" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                <option value="">{t('— none —')}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{t('Category')}</span>
              <select name="category_id" defaultValue={product?.category_id || ''}>
                <option value="">{t('— none —')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>{t('Supplier / vendor')}</span>
            <input name="vendor" defaultValue={product?.vendor || ''} />
          </label>

          <label>
            <span>{t('Description')}</span>
            <textarea name="description" rows={5} defaultValue={product?.description || ''} />
          </label>

          <label>
            <span>{t('Fitment note')}</span>
            <input
              name="fitment"
              defaultValue={product?.fitment || ''}
              placeholder={t('Fits Honda Activa 5G / 6G')}
            />
          </label>

          <label>
            <span>{t('Tags (comma separated)')}</span>
            <input name="tags" defaultValue={(product?.tags || []).join(', ')} />
          </label>
        </section>

        <section className="admin-card">
          <h2>{t('Pricing & stock')}</h2>

          <div className="admin-form-row">
            <label>
              <span>{t('Selling price (₹) *')}</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price ?? 0}
                required
              />
            </label>
            <label>
              <span>{t('MRP (₹)')}</span>
              <input
                name="mrp"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.mrp ?? 0}
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              <span>{t('GST %')}</span>
              <input
                name="gst_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue={product?.gst_rate ?? ''}
                placeholder={`${t('Store default')}: ${storeGst}%`}
              />
            </label>
            <label>
              <span>{t('Minimum order quantity (MOQ)')}</span>
              <input
                name="moq"
                type="number"
                min="1"
                step="1"
                defaultValue={product?.moq ?? ''}
                placeholder={`${t('Store default')}: ${defaultMoq}`}
              />
            </label>
          </div>
          <p className="admin-hint">
            {t('Selling price is before GST. Leave GST % or MOQ blank to use the store default from Settings.')}
          </p>

          <label>
            <span>{t('Stock quantity')}</span>
            <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} />
            <small className="admin-hint">{t('0 marks the product out of stock. Orders are not limited by this number.')}</small>
          </label>

          <label>
            <span>{t('3D model (.glb link, optional)')}</span>
            <input
              name="model_3d_url"
              type="url"
              defaultValue={product?.model_3d_url || ''}
              placeholder="https://…/part.glb"
            />
            <small className="admin-hint">
              {t('With a model, the 3D view shows it. Without one, the photos are shown as a rotating 3D panel.')}
            </small>
          </label>

          <label className="admin-check">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product ? product.is_active : true}
            />
            <span>{t('Visible on the storefront')}</span>
          </label>

          {isNew && (
            <label>
              <span>{t('Product images')}</span>
              <input type="file" name="images" accept="image/*" multiple />
              <small className="admin-hint">{t('JPG, PNG or WebP up to 5 MB each.')}</small>
            </label>
          )}

          <h2 className="admin-subhead">{t('Fits these models')}</h2>
          {!brandId ? (
            <p className="admin-hint">{t('Pick a brand to choose models.')}</p>
          ) : brandModels.length === 0 ? (
            <p className="admin-hint">{t('This brand has no models yet.')}</p>
          ) : (
            <div className="admin-fitment">
              {brandModels.map((m) => (
                <label key={m.id}>
                  <input
                    type="checkbox"
                    checked={fits.has(m.id)}
                    onChange={() => toggleFit(m.id)}
                  />
                  <span>{m.name}</span>
                </label>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="admin-form-actions">
        <SaveButton isNew={isNew} />
        <Link href="/admin/products" className="admin-ghost-btn">
          Cancel
        </Link>

        {product && (
          <>
            <button
              type="button"
              className="admin-ghost-btn"
              onClick={onToggleActive}
              disabled={busy}
            >
              {product.is_active ? 'Hide from store' : 'Publish to store'}
            </button>
            <Link
              href={`/product/${encodeURIComponent(product.id)}`}
              target="_blank"
              rel="noreferrer"
              className="admin-ghost-btn"
            >
              View on store ↗
            </Link>
            <button type="button" className="admin-danger-btn" onClick={onDelete} disabled={busy}>
              Delete
            </button>
          </>
        )}
      </div>
    </form>
  );
}
