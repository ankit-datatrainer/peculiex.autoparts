'use client';

import React from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signIn, signUp } from '../auth/actions';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="auth-submit" disabled={pending}>
      {pending ? 'Please wait…' : label}
    </button>
  );
}

export default function AuthForm({ mode = 'signin', next = '/account' }) {
  const isSignUp = mode === 'signup';
  const [state, action] = useFormState(isSignUp ? signUp : signIn, {});

  return (
    <div className="auth-shell">
      <form className="auth-card" action={action}>
        <h1>{isSignUp ? 'Create your account' : 'Sign in'}</h1>
        <p className="auth-sub">
          {isSignUp
            ? 'Track orders, save your address and check out faster.'
            : 'Access your orders, tracking and account.'}
        </p>

        <input type="hidden" name="next" value={next} />

        {isSignUp && (
          <>
            <label>
              <span>Full name</span>
              <input name="full_name" autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              <span>Mobile number</span>
              <input name="phone" autoComplete="tel" inputMode="tel" placeholder="10-digit mobile" />
            </label>
          </>
        )}

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
          />
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

        <SubmitButton label={isSignUp ? 'Create account' : 'Sign in'} />

        <p className="auth-switch">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <Link href={`/signin?next=${encodeURIComponent(next)}`}>Sign in</Link>
            </>
          ) : (
            <>
              New to MotoMart?{' '}
              <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
