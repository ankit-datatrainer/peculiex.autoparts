'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { clampQty, MAX_QTY } from '../lib/commerce';

/**
 * − [ 10 ] + with a typeable number. Never goes below `min` (the MOQ); the
 * field can be cleared while typing and settles on blur or Enter.
 */
export default function QtyStepper({ value, min = 1, onChange, className = '' }) {
  const { t } = useLanguage();
  const [text, setText] = useState(String(value));

  useEffect(() => setText(String(value)), [value]);

  const commit = (raw) => {
    const next = clampQty(raw === '' ? min : raw, min);
    setText(String(next));
    if (next !== value) onChange(next);
  };

  return (
    <div className={`qty-stepper qty-typed ${className}`.trim()}>
      <button
        type="button"
        aria-label={t('Decrease quantity')}
        onClick={() => commit(value - 1)}
        disabled={value <= min}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={MAX_QTY}
        value={text}
        aria-label={t('Quantity')}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => commit(text)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit(text);
          }
        }}
      />
      <button
        type="button"
        aria-label={t('Increase quantity')}
        onClick={() => commit(value + 1)}
        disabled={value >= MAX_QTY}
      >
        +
      </button>
    </div>
  );
}
