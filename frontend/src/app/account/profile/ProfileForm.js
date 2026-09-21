'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '../../auth/actions';
import { useLanguage } from '../../../context/LanguageContext';

function SaveButton({ label, waiting }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="account-cta" disabled={pending}>
      {pending ? waiting : label}
    </button>
  );
}

export default function ProfileForm({ profile, email }) {
  const { t } = useLanguage();
  const [state, action] = useFormState(updateProfile, {});

  return (
    <form action={action} className="profile-form">
      <label>
        <span>{t('Full name')}</span>
        <input name="full_name" defaultValue={profile?.full_name || ''} autoComplete="name" />
      </label>
      <label>
        <span>{t('Mobile number')}</span>
        <input name="phone" defaultValue={profile?.phone || ''} inputMode="tel" autoComplete="tel" />
      </label>
      <label>
        <span>{t('Email')}</span>
        <input value={email} readOnly />
      </label>

      {state?.error && (
        <p className="auth-error" role="alert">
          {t(state.error)}
        </p>
      )}
      {state?.notice && (
        <p className="auth-notice" role="status">
          {t(state.notice)}
        </p>
      )}

      <SaveButton label={t('Save changes')} waiting={t('Saving…')} />
    </form>
  );
}
