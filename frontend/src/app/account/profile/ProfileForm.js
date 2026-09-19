'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '../../auth/actions';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="account-cta" disabled={pending}>
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  );
}

export default function ProfileForm({ profile, email }) {
  const [state, action] = useFormState(updateProfile, {});

  return (
    <form action={action} className="profile-form">
      <label>
        <span>Full name</span>
        <input name="full_name" defaultValue={profile?.full_name || ''} autoComplete="name" />
      </label>
      <label>
        <span>Mobile number</span>
        <input name="phone" defaultValue={profile?.phone || ''} inputMode="tel" autoComplete="tel" />
      </label>
      <label>
        <span>Email</span>
        <input value={email} readOnly />
      </label>

      {state?.error && (
        <p className="auth-error" role="alert">
          {state.error}
        </p>
      )}
      {state?.notice && (
        <p className="auth-notice" role="status">
          {state.notice}
        </p>
      )}

      <SaveButton />
    </form>
  );
}
