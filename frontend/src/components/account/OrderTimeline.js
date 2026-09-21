'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ORDER_FLOW } from '../../lib/orderStatus';

const LOCALE = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN' };

const fmt = (ts, lang) =>
  new Date(ts).toLocaleString(LOCALE[lang] || LOCALE.en, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });

/**
 * A client component even though both callers are server pages: the tracking
 * timeline is the one piece of an order that a shopper re-reads, so it follows
 * the language without a round trip.
 */
export default function OrderTimeline({ status, events = [] }) {
  const { t, language } = useLanguage();

  if (status === 'cancelled') {
    const cancelledAt = events.find((e) => e.status === 'cancelled');
    return (
      <div className="track-cancelled">
        <strong>{t('This order was cancelled')}</strong>
        {cancelledAt && <small>{fmt(cancelledAt.created_at, language)}</small>}
        {cancelledAt?.note && <p>{t(cancelledAt.note)}</p>}
      </div>
    );
  }

  const reachedAt = {};
  for (const e of events) if (!reachedAt[e.status]) reachedAt[e.status] = e.created_at;

  const currentIndex = ORDER_FLOW.findIndex((s) => s.id === status);

  return (
    <ol className="track-timeline">
      {ORDER_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className={`${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <span className="track-dot" aria-hidden="true" />
            <div>
              <strong>{t(step.label)}</strong>
              <small>{reachedAt[step.id] ? fmt(reachedAt[step.id], language) : t(step.hint)}</small>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
