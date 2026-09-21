'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import catalogIndex from '../data/eauto/index.json';
import { useLanguage } from '../context/LanguageContext';

const shape = (list) =>
  list.map((b) => ({
    id: b.id,
    name: b.name,
    modelCount: b.modelCount ?? b.models?.length ?? 0,
    partsCount: b.partsCount ?? 0,
    models: (b.models || []).map((m) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      partsCount: m.partsCount ?? 0
    }))
  }));

const FALLBACK_BRANDS = shape(catalogIndex.brands);

const PANEL_WIDTH = 760;
const CLOSE_DELAY = 160;

export default function BrandNavStrip({ brands }) {
  const { t } = useLanguage();
  const BRANDS = brands?.length ? shape(brands) : FALLBACK_BRANDS;

  const [openId, setOpenId] = useState(null);
  const [pos, setPos] = useState({ left: 0, top: 0, width: PANEL_WIDTH, maxHeight: 520 });

  const navRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);

  // The panel is positioned fixed so the horizontally scrolling strip can't clip it.
  const place = useCallback(() => {
    const nav = navRef.current;
    const trigger = triggerRef.current;
    if (!nav || !trigger) return;

    const navRect = nav.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, window.innerWidth - 24);
    const left = Math.max(12, Math.min(triggerRect.left, window.innerWidth - width - 12));
    // never taller than the space left under the header
    const maxHeight = Math.max(220, window.innerHeight - navRect.bottom - 16);

    setPos({ left, top: navRect.bottom, width, maxHeight });
  }, []);

  const openBrand = (id, el) => {
    clearTimeout(closeTimer.current);
    triggerRef.current = el;
    setOpenId(id);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
  };

  const closeNow = () => {
    clearTimeout(closeTimer.current);
    setOpenId(null);
  };

  useEffect(() => {
    if (openId) place();
  }, [openId, place]);

  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeNow();
    };
    // capture phase so the strip's own horizontal scrolling repositions the panel too
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      document.removeEventListener('keydown', onKey);
    };
  }, [openId, place]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const active = BRANDS.find((b) => b.id === openId);
  const bikes = active ? active.models.filter((m) => m.type === 'bike') : [];
  const scooters = active ? active.models.filter((m) => m.type === 'scooter') : [];

  const renderModels = (models) => (
    <div className="brand-nav-models">
      {models.map((m) => (
        <Link
          key={m.id}
          href={`/brands/${active.id}/${m.id}`}
          onClick={closeNow}
          title={m.name}
        >
          <span>{m.name}</span>
          <em>{m.partsCount}</em>
        </Link>
      ))}
    </div>
  );

  return (
    <nav
      className="nav-strip brand-nav"
      aria-label={t('Shop spare parts by brand')}
      ref={navRef}
      onMouseLeave={scheduleClose}
    >
      {BRANDS.map((brand) => (
        <Link
          key={brand.id}
          href={`/brands/${brand.id}`}
          className={`brand-nav-item ${openId === brand.id ? 'open' : ''}`}
          aria-haspopup="true"
          aria-expanded={openId === brand.id}
          onMouseEnter={(e) => openBrand(brand.id, e.currentTarget)}
          onFocus={(e) => openBrand(brand.id, e.currentTarget)}
          onClick={closeNow}
        >
          {brand.name}
        </Link>
      ))}

      <Link
        href="/categories"
        className="brand-nav-all"
        onMouseEnter={scheduleClose}
        onFocus={scheduleClose}
        onClick={closeNow}
      >
        {t('Shop by category')}
      </Link>

      <Link
        href="/brands"
        className="brand-nav-all"
        onMouseEnter={scheduleClose}
        onFocus={scheduleClose}
        onClick={closeNow}
      >
        {t('All brands')} →
      </Link>

      {active && (
        <div
          className="brand-nav-panel"
          role="menu"
          aria-label={`${active.name} models`}
          style={{ left: pos.left, top: pos.top, width: pos.width, maxHeight: pos.maxHeight }}
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          onMouseLeave={scheduleClose}
        >
          <div className="brand-nav-panel-head">
            <strong>{active.name}</strong>
            <small>
              {active.modelCount} model{active.modelCount === 1 ? '' : 's'} ·{' '}
              {active.partsCount.toLocaleString('en-IN')} part
              {active.partsCount === 1 ? '' : 's'}
            </small>
          </div>

          <div className="brand-nav-panel-body">
            {bikes.length > 0 && (
              <>
                <h4>{t('Bikes')}</h4>
                {renderModels(bikes)}
              </>
            )}
            {scooters.length > 0 && (
              <>
                <h4>{t('Scooters')}</h4>
                {renderModels(scooters)}
              </>
            )}
          </div>

          <Link href={`/brands/${active.id}`} className="brand-nav-more" onClick={closeNow}>
            View more — all {active.name} models &amp; parts <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
