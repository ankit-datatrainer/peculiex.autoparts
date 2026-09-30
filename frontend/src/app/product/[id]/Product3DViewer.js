'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { onImageError } from '../../../lib/imageFallback';

const MODEL_VIEWER_SRC = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js';

/** Loads Google's <model-viewer> once, only for products that have a .glb model. */
function useModelViewer(enabled) {
  const [ready, setReady] = useState(
    () => typeof window !== 'undefined' && Boolean(window.customElements?.get('model-viewer'))
  );
  useEffect(() => {
    if (!enabled || ready) return;
    let script = document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = MODEL_VIEWER_SRC;
      document.head.appendChild(script);
    }
    window.customElements.whenDefined('model-viewer').then(() => setReady(true));
  }, [enabled, ready]);
  return ready;
}

/**
 * Drag-to-rotate 3D view of the product.
 *
 * With a real 3D model (.glb, set in the admin) it uses <model-viewer>.
 * Otherwise the photos become a solid 3D panel: the front photo on the front,
 * the back photo (when the listing has one) on the back, turned with the mouse
 * or a finger, zoomed with the wheel, and spinning slowly on its own.
 */
export default function Product3DViewer({ front, back = null, title = '', modelUrl = null, onClose }) {
  const { t } = useLanguage();
  const [rot, setRot] = useState({ x: -8, y: -24 });
  const [zoom, setZoom] = useState(1);
  const [spin, setSpin] = useState(true);
  const drag = useRef(null);
  const closeRef = useRef(null);
  const modelReady = useModelViewer(Boolean(modelUrl));

  // Close on Escape; keep focus inside the dialog while it is open.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setRot((r) => ({ ...r, y: r.y - 15 }));
      if (e.key === 'ArrowRight') setRot((r) => ({ ...r, y: r.y + 15 }));
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  // Slow turntable spin until the shopper grabs it.
  useEffect(() => {
    if (!spin || modelUrl) return undefined;
    let frame;
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      setRot((r) => ({ ...r, y: r.y + dt * 0.03 }));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spin, modelUrl]);

  const onPointerDown = (e) => {
    setSpin(false);
    drag.current = { x: e.clientX, y: e.clientY, rot };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setRot({
      y: drag.current.rot.y + dx * 0.5,
      x: Math.max(-70, Math.min(70, drag.current.rot.x - dy * 0.4))
    });
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onWheel = (e) => {
    setZoom((z) => Math.max(0.6, Math.min(2.2, z - e.deltaY * 0.0012)));
  };

  const turn = (deg) => {
    setSpin(false);
    setRot((r) => ({ ...r, y: Math.round((r.y + deg) / 90) * 90 }));
  };

  // Which side is facing the camera, for the caption.
  const facing = (((rot.y % 360) + 360) % 360);
  const showingBack = facing > 90 && facing < 270;

  return (
    <div className="p3d-backdrop" role="dialog" aria-modal="true" aria-label={`${t('3D view')} — ${title}`} onClick={onClose}>
      <div className="p3d-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="p3d-head">
          <div>
            <strong>{t('3D view')}</strong>
            <span>{title}</span>
          </div>
          <button ref={closeRef} type="button" className="p3d-close" onClick={onClose} aria-label={t('Close')}>
            ×
          </button>
        </div>

        {modelUrl ? (
          <div className="p3d-stage">
            {modelReady ? (
              React.createElement('model-viewer', {
                src: modelUrl,
                alt: title,
                'camera-controls': true,
                'auto-rotate': true,
                'shadow-intensity': '1',
                'touch-action': 'pan-y',
                style: { width: '100%', height: '100%', background: 'transparent' }
              })
            ) : (
              <p className="p3d-loading">{t('Loading 3D model…')}</p>
            )}
          </div>
        ) : (
          <div
            className="p3d-stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          >
            <div
              className="p3d-object"
              style={{ transform: `scale(${zoom}) rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
            >
              <div className="p3d-face p3d-front">
                <img src={front} alt={title} draggable="false" onError={onImageError} />
              </div>
              <div className={`p3d-face p3d-back ${back ? '' : 'mirrored'}`}>
                <img src={back || front} alt="" draggable="false" onError={onImageError} />
              </div>
              <div className="p3d-edge p3d-edge-l" />
              <div className="p3d-edge p3d-edge-r" />
              <div className="p3d-edge p3d-edge-t" />
              <div className="p3d-edge p3d-edge-b" />
            </div>
            <div className="p3d-floor" aria-hidden="true" />
          </div>
        )}

        {!modelUrl && (
          <div className="p3d-controls">
            <span className="p3d-side">{showingBack ? t('Back view') : t('Front view')}</span>
            <div>
              <button type="button" onClick={() => turn(-90)} aria-label={t('Rotate left')}>↺</button>
              <button type="button" onClick={() => setSpin((s) => !s)}>
                {spin ? t('Pause') : t('Spin')}
              </button>
              <button type="button" onClick={() => turn(90)} aria-label={t('Rotate right')}>↻</button>
              <button type="button" onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))} aria-label={t('Zoom in')}>＋</button>
              <button type="button" onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} aria-label={t('Zoom out')}>－</button>
              <button
                type="button"
                onClick={() => {
                  setRot({ x: -8, y: -24 });
                  setZoom(1);
                  setSpin(true);
                }}
              >
                {t('Reset')}
              </button>
            </div>
            <small>{t('Drag to rotate · scroll to zoom')}</small>
          </div>
        )}
      </div>
    </div>
  );
}
