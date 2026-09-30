'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { onImageError, FALLBACK_IMAGE } from '../../../lib/imageFallback';
import Product3DViewer from './Product3DViewer';

// Supplier listings photograph the front first and the back second.
const DEFAULT_LABELS = ['Front view', 'Back view'];
export const VIEW_LABELS = ['Front view', 'Back view', 'Side view', 'Top view', 'Detail view'];

const AUTOPLAY_MS = 3500;

/**
 * Builds the list of views: every real photo, labelled (admin labels win,
 * then front/back), plus — when there is only one photo — two angled
 * presentations and a close-up of it, so the gallery still has views to cycle.
 */
function buildViews(images, labels) {
  const real = images.map((src, i) => ({
    key: `img-${i}`,
    src,
    label: labels[i] || DEFAULT_LABELS[i] || 'Detail view',
    kind: 'photo'
  }));

  if (real.length === 1) {
    const src = real[0].src;
    real.push(
      { key: 'angle-left', src, label: 'Left angle', kind: 'angle-left' },
      { key: 'angle-right', src, label: 'Right angle', kind: 'angle-right' },
      { key: 'close-up', src, label: 'Close-up', kind: 'close-up' }
    );
  }
  return real;
}

export default function ProductGallery({ images = [], labels = [], title = '', model3dUrl = null }) {
  const { t } = useLanguage();
  const photos = useMemo(() => {
    const unique = [...new Set((images || []).filter(Boolean))];
    return unique.length ? unique : [FALLBACK_IMAGE];
  }, [images]);

  const views = useMemo(() => buildViews(photos, labels || []), [photos, labels]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const touchX = useRef(null);

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + views.length) % views.length),
    [views.length]
  );

  // The gallery turns by itself until the shopper takes over.
  useEffect(() => {
    if (paused || show3d || views.length < 2) return undefined;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, show3d, views.length, go]);

  useEffect(() => setIndex(0), [views]);

  const current = views[Math.min(index, views.length - 1)];

  const pick = (i) => {
    setIndex(i);
    setPaused(true);
  };

  return (
    <div className="detail-gallery pg">
      <div className="thumb-list pg-thumbs" role="tablist" aria-label={t('Product views')}>
        {views.map((v, i) => (
          <button
            key={v.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`pg-thumb ${i === index ? 'active' : ''}`}
            onClick={() => pick(i)}
            title={t(v.label)}
          >
            <span className={`pg-thumb-img pg-${v.kind}`}>
              <img src={v.src} alt="" loading="lazy" onError={onImageError} />
            </span>
            <small>{t(v.label)}</small>
          </button>
        ))}
        <button
          type="button"
          className="pg-thumb pg-thumb-3d"
          onClick={() => setShow3d(true)}
          title={t('3D view')}
        >
          <span className="pg-thumb-img">
            <span className="pg-3d-badge" aria-hidden="true">3D</span>
          </span>
          <small>{t('3D view')}</small>
        </button>
      </div>

      <div
        className="main-image-wrap pg-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div key={current.key} className={`pg-view pg-${current.kind}`}>
          <img src={current.src} alt={`${title} — ${t(current.label)}`} onError={onImageError} />
        </div>

        <span className="pg-label">{t(current.label)}</span>

        {views.length > 1 && (
          <>
            <button type="button" className="pg-nav pg-prev" onClick={() => { go(-1); setPaused(true); }} aria-label={t('Previous view')}>
              ‹
            </button>
            <button type="button" className="pg-nav pg-next" onClick={() => { go(1); setPaused(true); }} aria-label={t('Next view')}>
              ›
            </button>
            <div className="pg-dots" aria-hidden="true">
              {views.map((v, i) => (
                <i key={v.key} className={i === index ? 'on' : ''} />
              ))}
            </div>
          </>
        )}

        <button type="button" className="pg-open-3d" onClick={() => setShow3d(true)}>
          <span aria-hidden="true">⟳</span> {t('3D view')}
        </button>
      </div>

      {show3d && (
        <Product3DViewer
          front={photos[0]}
          back={photos[1] || null}
          title={title}
          modelUrl={model3dUrl}
          onClose={() => setShow3d(false)}
        />
      )}
    </div>
  );
}
