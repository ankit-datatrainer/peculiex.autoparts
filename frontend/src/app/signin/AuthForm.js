'use client';

import React from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signIn, signUp } from '../auth/actions';
import { useLanguage } from '../../context/LanguageContext';

function SubmitButton({ label, waiting }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-submit" disabled={pending}>
      {pending ? waiting : label}
    </button>
  );
}

export default function AuthForm({ mode = 'signin', next = '/account' }) {
  const { t } = useLanguage();
  const isSignUp = mode === 'signup';
  const [state, action] = useFormState(isSignUp ? signUp : signIn, {});

  return (
    <div className="auth-shell">
      <form className="auth-card" action={action}>
        <h1>{isSignUp ? t('Create your account') : t('Sign in')}</h1>
        <p className="auth-sub">
          {isSignUp
            ? t('Track orders, save your address and check out faster.')
            : t('Access your orders, tracking and account.')}
        </p>

        <input type="hidden" name="next" value={next} />

        {isSignUp && (
          <>
            <label>
              <span>{t('Full name')}</span>
              <input name="full_name" autoComplete="name" placeholder={t('Your name')} />
            </label>
            <label>
              <span>{t('Mobile number')}</span>
              <input
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder={t('10-digit mobile')}
              />
            </label>
          </>
        )}

        <label>
          <span>{t('Email')}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>

        <label>
          <span>{t('Password')}</span>
          <input
            name="password"
            type="password"
            required
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            placeholder={isSignUp ? t('At least 8 characters') : t('Your password')}
          />
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

        <SubmitButton
          label={isSignUp ? t('Create account') : t('Sign in')}
          waiting={t('Please wait…')}
        />

        <p className="auth-switch">
          {isSignUp ? (
            <>
              {t('Already have an account?')}{' '}
              <Link href={`/signin?next=${encodeURIComponent(next)}`}>{t('Sign in')}</Link>
            </>
          ) : (
            <>
              {t('New to MotoMart?')}{' '}
              <Link href={`/signup?next=${encodeURIComponent(next)}`}>{t('Create an account')}</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
