'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import { emailConfigured, sendPasswordResetEmail } from '../../lib/email';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../lib/translations';
import {
  NOT_READY,
  RESEND_AFTER_S,
  findUserByEmail,
  issueCode,
  releaseCooldown,
  checkCode,
  markVerified
} from '../../lib/otp';

const NOT_CONFIGURED =
  'Accounts are not available yet — Supabase is not configured for this site.';

function safeNext(value) {
  // only allow same-origin paths, never an absolute URL
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/account';
}

export async function signIn(_prevState, formData) {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = safeNext(formData.get('next'));

  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = createClient();
  let { error } = await supabase.auth.signInWithPassword({ email, password });

  // Accounts made with the old confirmation-link sign-up and never confirmed:
  // the link step is gone, so let them in — the email code still has to be
  // entered before prices show.
  if (error && /not confirmed/i.test(error.message)) {
    const admin = createAdminClient();
    const user = admin && (await findUserByEmail(admin, email));
    if (user) {
      await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    }
  }

  if (error) {
    if (/invalid login credentials/i.test(error.message)) return { error: 'Wrong email or password.' };
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(next);
}

export async function signUp(_prevState, formData) {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const fullName = String(formData.get('full_name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const next = safeNext(formData.get('next'));

  if (!email || !password) return { error: 'Enter your email and a password.' };
  if (password.length < 8) return { error: 'Use at least 8 characters for your password.' };

  const admin = createAdminClient();
  if (!admin) return { error: NOT_READY };

  // Created already confirmed, so Supabase sends no confirmation link; the
  // customer verifies the address with a 6-digit code on the next screen.
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone }
  });
  if (createError) {
    if (/already|registered|exists/i.test(createError.message)) {
      return { error: 'An account with this email already exists. Sign in instead.' };
    }
    return { error: createError.message };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  redirect(`/verify-email?send=1&next=${encodeURIComponent(next)}`);
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function updateProfile(_prevState, formData) {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out.' };

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: String(formData.get('full_name') || '').trim(),
      phone: String(formData.get('phone') || '').trim()
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/account');
  return { notice: 'Profile saved.' };
}

// -----------------------------------------------------------------------------
// Forgot password: a 6-digit code by email, then a new password
// -----------------------------------------------------------------------------
function mailLanguage() {
  const lang = cookies().get('motomart-language')?.value;
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
}

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function requestPasswordReset(_prevState, formData) {
  const email = String(formData.get('email') || '').trim();
  if (!validEmail(email)) return { error: 'Enter a valid email address.' };

  const admin = createAdminClient();
  if (!admin || !emailConfigured()) return { error: NOT_READY };

  const user = await findUserByEmail(admin, email);
  // Same answer whether or not the account exists, so the form cannot be used
  // to find out who has an account.
  if (!user) return { sent: true, email, retryIn: RESEND_AFTER_S };

  const issued = await issueCode(admin, user, 'reset');
  if (issued.error) return { ...issued, email, sent: Boolean(issued.retryIn) };

  const result = await sendPasswordResetEmail({ to: user.email, code: issued.code, lang: mailLanguage() });
  if (!result.sent) {
    await releaseCooldown(admin, user.id);
    console.error('[forgot-password] send failed:', result.error || result.reason);
    return { error: 'We could not send the email right now. Please try again in a minute.' };
  }
  return { sent: true, email, retryIn: RESEND_AFTER_S };
}

export async function resetPasswordWithCode(_prevState, formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');
  const next = safeNext(formData.get('next'));

  if (password.length < 8) return { error: 'Use at least 8 characters for your password.' };
  if (password !== confirm) return { error: 'The two passwords do not match.' };

  const admin = createAdminClient();
  if (!admin) return { error: NOT_READY };

  const user = await findUserByEmail(admin, email);
  if (!user) return { error: 'That code is not right.' };

  const checked = await checkCode(admin, user, 'reset', formData.get('code'));
  if (!checked.ok) return checked;

  const { error } = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  if (error) return { error: error.message };

  // The code reached their inbox, so the address is proven too.
  await markVerified(admin, user);

  const supabase = createClient();
  await supabase.auth.signInWithPassword({ email, password });

  revalidatePath('/', 'layout');
  redirect(next === '/account' ? '/account?reset=1' : next);
}
