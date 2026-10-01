'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import PasswordInput from '../../components/PasswordInput';
import { requestPasswordReset, resetPasswordWithCode } from '../auth/actions';

function Submit({ label, waiting }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-submit" disabled={pending}>
      {pending ? waiting : label}
    </button>
  );
}

export default function ForgotPasswordClient({ next = '/account' }) {
  const { t, local } = useLanguage();
  const [sendState, send] = useFormState(requestPasswordReset, {});
  const [resetState, reset] = useFormState(resetPasswordWithCode, {});
  const [cooldown, setCooldown] = useState(0);

  const email = sendState?.email || '';
  const sent = Boolean(sendState?.sent);

  useEffect(() => {
    if (sendState?.retryIn) setCooldown(sendState.retryIn);
  }, [sendState]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  return (
    <div className="auth-shell">
      <div className="auth-card verify-card">
        <span className="verify-icon" aria-hidden="true">🔑</span>
        <h1>{t('Reset your password')}</h1>

        {!sent ? (
          <form action={send} className="verify-form">
            <p className="auth-sub">{t('Enter your account email. We will send you a 6-digit code.')}</p>
            <label>
              <span>{t('Email')}</span>
              <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
            </label>
            {sendState?.error && (
              <p className="auth-error" role="alert">
                {t(sendState.error)}
              </p>
            )}
            <Submit label={t('Send code')} waiting={t('Sending…')} />
          </form>
        ) : (
          <form action={reset} className="verify-form">
            <p className="auth-sub">
              {t('If an account exists for this email, we sent a 6-digit code to')} <strong>{email}</strong>
            </p>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="next" value={next} />
            <label>
              <span>{t('Verification code')}</span>
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9 ]*"
                maxLength={7}
                placeholder="••••••"
                className="verify-code-input"
                autoFocus
                required
              />
            </label>
            <label>
              <span>{t('New password')}</span>
              <PasswordInput autoComplete="new-password" placeholder={t('At least 8 characters')} minLength={8} />
            </label>
            <label>
              <span>{t('Confirm new password')}</span>
              <PasswordInput name="confirm" autoComplete="new-password" placeholder={t('Type it again')} minLength={8} />
            </label>

            {resetState?.error && (
              <p className="auth-error" role="alert">
                {t(resetState.error)}
                {typeof resetState.triesLeft === 'number' && (
                  <>
                    {' '}
                    {local(
                      `${resetState.triesLeft} tries left.`,
                      `${resetState.triesLeft} प्रयास बाकी।`,
                      `${resetState.triesLeft} प्रयत्न शिल्लक.`,
                      `${resetState.triesLeft} પ્રયાસ બાકી.`
                    )}
                  </>
                )}
              </p>
            )}
            {sendState?.error && (
              <p className="auth-error" role="alert">
                {t(sendState.error)}
              </p>
            )}

            <Submit label={t('Save new password')} waiting={t('Checking…')} />
          </form>
        )}

        {sent && (
          <form action={send} className="verify-resend">
            <input type="hidden" name="email" value={email} />
            {t('Did not get it? Check spam, or')}{' '}
            <button type="submit" disabled={cooldown > 0}>
              {cooldown > 0
                ? local(
                    `resend in ${cooldown}s`,
                    `${cooldown} सेकंड में फिर भेजें`,
                    `${cooldown} सेकंदांत पुन्हा पाठवा`,
                    `${cooldown} સેકન્ડમાં ફરી મોકલો`
                  )
                : t('send a new code')}
            </button>
          </form>
        )}

        <p className="auth-switch">
          {t('Remembered it?')} <Link href={`/signin?next=${encodeURIComponent(next)}`}>{t('Sign in')}</Link>
        </p>
      </div>
    </div>
  );
}
