'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { sendVerificationCode, confirmVerificationCode } from './actions';

function VerifyButton() {
  const { t } = useLanguage();
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-submit" disabled={pending}>
      {pending ? t('Checking…') : t('Verify email')}
    </button>
  );
}

export default function VerifyEmailClient({ email, next = '/' }) {
  const { t, local } = useLanguage();
  const router = useRouter();
  const [sending, startSending] = useTransition();
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [state, confirm] = useFormState(confirmVerificationCode, {});

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Verified: every price on the site unlocks, then back to where they were.
  useEffect(() => {
    if (!state?.verified) return undefined;
    router.refresh();
    const id = setTimeout(() => {
      router.push(next);
      router.refresh();
    }, 1200);
    return () => clearTimeout(id);
  }, [state?.verified, next, router]);

  const send = () =>
    startSending(async () => {
      setSendError('');
      const res = await sendVerificationCode();
      if (res?.sent) {
        setSent(true);
        setCooldown(res.retryIn || 45);
      } else {
        setSendError(res?.error || 'We could not send the email right now. Please try again in a minute.');
        if (res?.retryIn) {
          setSent(true);
          setCooldown(res.retryIn);
        }
      }
    });

  if (state?.verified) {
    return (
      <div className="auth-shell">
        <div className="auth-card verify-card">
          <span className="verify-icon done" aria-hidden="true">✓</span>
          <h1>{t('Email verified')}</h1>
          <p className="auth-sub">{t('Prices are now visible on every product. Taking you back…')}</p>
          <Link href={next} className="auth-submit verify-continue">
            {t('Continue shopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card verify-card">
        <span className="verify-icon" aria-hidden="true">✉</span>
        <h1>{t('Verify your email to see prices')}</h1>
        <p className="auth-sub">
          {sent
            ? t('We sent a 6-digit code to')
            : t('We will send a 6-digit code to')}{' '}
          <strong>{email}</strong>
        </p>

        {!sent ? (
          <button type="button" className="auth-submit" onClick={send} disabled={sending}>
            {sending ? t('Sending…') : t('Send code')}
          </button>
        ) : (
          <form action={confirm} className="verify-form">
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

            {state?.error && (
              <p className="auth-error" role="alert">
                {t(state.error)}
                {typeof state.triesLeft === 'number' && (
                  <>
                    {' '}
                    {local(
                      `${state.triesLeft} tries left.`,
                      `${state.triesLeft} प्रयास बाकी।`,
                      `${state.triesLeft} प्रयत्न शिल्लक.`,
                      `${state.triesLeft} પ્રયાસ બાકી.`
                    )}
                  </>
                )}
              </p>
            )}

            <VerifyButton />

            <p className="verify-resend">
              {t('Did not get it? Check spam, or')}{' '}
              <button type="button" onClick={send} disabled={sending || cooldown > 0}>
                {cooldown > 0
                  ? local(
                      `resend in ${cooldown}s`,
                      `${cooldown} सेकंड में फिर भेजें`,
                      `${cooldown} सेकंदांत पुन्हा पाठवा`,
                      `${cooldown} સેકન્ડમાં ફરી મોકલો`
                    )
                  : t('send a new code')}
              </button>
            </p>
          </form>
        )}

        {sendError && (
          <p className="auth-error" role="alert">
            {t(sendError)}
          </p>
        )}

        <p className="auth-switch">
          {t('Not your email?')}{' '}
          <Link href={`/signin?next=${encodeURIComponent(`/verify-email?next=${encodeURIComponent(next)}`)}`}>
            {t('Sign in with another account')}
          </Link>
        </p>
      </div>
    </div>
  );
}
