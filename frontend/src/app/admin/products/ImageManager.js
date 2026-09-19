'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { uploadProductImages, removeProductImage, reorderProductImages } from '../actions';

function UploadButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-primary-btn" disabled={pending}>
      {pending ? 'Uploading…' : label}
    </button>
  );
}

export default function ImageManager({ productId, images = [] }) {
  const router = useRouter();
  const [state, action] = useFormState(uploadProductImages, {});
  const [mode, setMode] = useState('add');
  const [busy, setBusy] = useState(false);

  const remove = async (url) => {
    if (!confirm('Remove this image from the product?')) return;
    setBusy(true);
    const res = await removeProductImage(productId, url);
    setBusy(false);
    if (res?.error) alert(res.error);
    router.refresh();
  };

  const move = async (index, delta) => {
    const next = [...images];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setBusy(true);
    const res = await reorderProductImages(productId, next);
    setBusy(false);
    if (res?.error) alert(res.error);
    router.refresh();
  };

  return (
    <section className="admin-card">
      <h2>Images</h2>
      <p className="admin-hint">
        The first image is the one shoppers see on cards and search results.
      </p>

      {images.length === 0 ? (
        <p className="admin-empty">No images yet.</p>
      ) : (
        <ul className="admin-image-grid">
          {images.map((url, i) => (
            <li key={url}>
              <img src={url} alt={`Product image ${i + 1}`} />
              {i === 0 && <span className="admin-image-primary">Primary</span>}
              <div className="admin-image-actions">
                <button type="button" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Move earlier">
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={busy || i === images.length - 1}
                  aria-label="Move later"
                >
                  →
                </button>
                <button type="button" className="danger" onClick={() => remove(url)} disabled={busy} aria-label="Remove image">
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="admin-upload">
        <input type="hidden" name="product_id" value={productId} />
        <input type="hidden" name="mode" value={mode} />

        <label>
          <span>Upload images</span>
          <input type="file" name="images" accept="image/*" multiple required />
          <small className="admin-hint">JPG, PNG or WebP up to 5 MB each.</small>
        </label>

        <div className="admin-upload-actions">
          <UploadButton label={mode === 'replace' ? 'Replace all images' : 'Add images'} />
          <label className="admin-check">
            <input
              type="checkbox"
              checked={mode === 'replace'}
              onChange={(e) => setMode(e.target.checked ? 'replace' : 'add')}
            />
            <span>Replace existing images instead of adding</span>
          </label>
        </div>

        {state?.error && <p className="admin-error">{state.error}</p>}
        {state?.notice && <p className="admin-notice">{state.notice}</p>}
      </form>
    </section>
  );
}
