'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/** Password field with a Show / Hide button. */
export default function PasswordInput({ name = 'password', autoComplete, placeholder, minLength }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-field">
      <input
        name={name}
        type={visible ? 'text' : 'password'}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? t('Hide password') : t('Show password')}
      >
        {visible ? t('Hide') : t('Show')}
      </button>
    </span>
  );
}
