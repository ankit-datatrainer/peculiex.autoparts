'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { signIn } from '../../lib/api';

export default function SignInModal() {
  const { t } = useLanguage();
  const { activeModal, closeModal, showToast } = useCart();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'signin') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    try {
      const res = await signIn(identifier.trim());
      if (res.success) {
        showToast(`Welcome ${res.user.name}! Demo sign-in successful.`);
      } else {
        showToast('Demo sign-in submitted successfully.');
      }
    } catch (err) {
      showToast('Demo sign-in submitted successfully.');
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <div className="overlay" onClick={closeModal} />
      <div className="modal compact" id="signinModal" role="dialog" aria-modal="true" aria-labelledby="signinTitle">
        <button className="modal-close" onClick={closeModal} aria-label={t('Close')}>
          ×
        </button>
        <div className="signin-logo">
          <img src="/assets/site-icon.svg" alt={t('MotoMart logo')} width="54" height="54" />
        </div>
        <h2 id="signinTitle">{t('Sign in to MotoMart')}</h2>
        <form id="signinForm" onSubmit={handleSubmit}>
          <label>
            {t('Email or mobile number')}
            <input
              type="text"
              required
              placeholder={t('Enter email or mobile')}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoFocus
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : t('Continue')}
          </button>
        </form>
        <small>
          {t('By continuing, you agree to MotoMart’s Conditions of Use and Privacy Notice.')}
        </small>
      </div>
    </>
  );
}
