'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { saveProduct, deleteProduct, setProductActive } from '../actions';

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
  const router = useRouter();
  const isNew = !product;
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
          <h2>Details</h2>

          <label>
            <span>Product name *</span>
            <input name="name" defaultValue={product?.name || ''} required />
          </label>

          <div className="admin-form-row">
            <label>
              <span>Product id {isNew && <em>(optional)</em>}</span>
              <input
                name="id"
                defaultValue={product?.id || ''}
                readOnly={!isNew}
                placeholder={isNew ? 'auto-generated' : ''}
              />
            </label>
            <label>
              <span>SKU / part number</span>
              <input name="sku" defaultValue={product?.sku || ''} />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              <span>Brand</span>
              <select name="brand_id" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                <option value="">— none —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Category</span>
              <select name="category_id" defaultValue={product?.category_id || ''}>
                <option value="">— none —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>Supplier / vendor</span>
            <input name="vendor" defaultValue={product?.vendor || ''} />
          </label>

          <label>
            <span>Description</span>
            <textarea name="description" rows={5} defaultValue={product?.description || ''} />
          </label>

          <label>
            <span>Fitment note</span>
            <input
              name="fitment"
              defaultValue={product?.fitment || ''}
              placeholder="Fits Honda Activa 5G / 6G"
            />
          </label>

          <label>
            <span>Tags (comma separated)</span>
            <input name="tags" defaultValue={(product?.tags || []).join(', ')} />
          </label>
        </section>

        <section className="admin-card">
          <h2>Pricing &amp; stock</h2>

          <div className="admin-form-row">
            <label>
              <span>Selling price (₹) *</span>
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
              <span>MRP (₹)</span>
              <input
                name="mrp"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.mrp ?? 0}
              />
            </label>
          </div>

          <label>
            <span>Stock quantity</span>
            <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} />
          </label>

          <label className="admin-check">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product ? product.is_active : true}
            />
            <span>Visible on the storefront</span>
          </label>

          {isNew && (
            <label>
              <span>Product images</span>
              <input type="file" name="images" accept="image/*" multiple />
              <small className="admin-hint">JPG, PNG or WebP up to 5 MB each.</small>
            </label>
          )}

          <h2 className="admin-subhead">Fits these models</h2>
          {!brandId ? (
            <p className="admin-hint">Pick a brand to choose models.</p>
          ) : brandModels.length === 0 ? (
            <p className="admin-hint">This brand has no models yet.</p>
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
