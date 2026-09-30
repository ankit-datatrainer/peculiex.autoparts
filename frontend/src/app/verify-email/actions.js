'use server';

import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import { emailConfigured, sendVerificationEmail } from '../../lib/email';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../lib/translations';

const CODE_TTL_MS = 10 * 60 * 1000; // a code works for 10 minutes
const RESEND_AFTER_S = 45; // wait between two codes
const MAX_SENDS_PER_HOUR = 5;
const MAX_ATTEMPTS = 5; // wrong guesses before the code is burned

const NOT_READY = 'Email verification is not set up on this server yet. Please contact us.';

/** Codes are stored hashed and peppered with a server-only secret. */
function hashCode(userId, code) {
  return crypto
    .createHash('sha256')
    .update(`${userId}:${code}:${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`)
    .digest('hex');
}

function sameHash(a, b) {
  const x = Buffer.from(String(a || ''), 'hex');
  const y = Buffer.from(String(b || ''), 'hex');
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
}

async function currentUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user || null;
}

function mailLanguage() {
  const lang = cookies().get('motomart-language')?.value;
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
}

/** Emails a fresh 6-digit code to the signed-in customer's address. */
export async function sendVerificationCode() {
  const user = await currentUser();
  if (!user) return { error: 'Please sign in first.' };
  if (!user.email) return { error: 'Your account has no email address.' };

  const admin = createAdminClient();
  if (!admin || !emailConfigured()) {
    console.error('[verify-email] missing SUPABASE_SERVICE_ROLE_KEY or SMTP settings');
    return { error: NOT_READY };
  }

  const { data: existing, error: readError } = await admin
    .from('email_otps')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (readError) {
    console.error('[verify-email] email_otps unavailable — has migration 0003 run?', readError.message);
    return { error: NOT_READY };
  }

  const now = Date.now();
  if (existing) {
    const since = (now - new Date(existing.last_sent_at).getTime()) / 1000;
    if (since < RESEND_AFTER_S) {
      return { error: 'Please wait a moment before asking for a new code.', retryIn: Math.ceil(RESEND_AFTER_S - since) };
    }
  }

  const windowFresh = existing && now - new Date(existing.window_start).getTime() < 60 * 60 * 1000;
  const sentCount = windowFresh ? existing.sent_count + 1 : 1;
  if (sentCount > MAX_SENDS_PER_HOUR) {
    return { error: 'Too many codes requested. Please try again in an hour.' };
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const { error: saveError } = await admin.from('email_otps').upsert(
    {
      user_id: user.id,
      email: user.email,
      code_hash: hashCode(user.id, code),
      expires_at: new Date(now + CODE_TTL_MS).toISOString(),
      attempts: 0,
      sent_count: sentCount,
      window_start: windowFresh ? existing.window_start : new Date(now).toISOString(),
      last_sent_at: new Date(now).toISOString()
    },
    { onConflict: 'user_id' }
  );
  if (saveError) {
    console.error('[verify-email] could not save code:', saveError.message);
    return { error: NOT_READY };
  }

  const result = await sendVerificationEmail({ to: user.email, code, lang: mailLanguage() });
  if (!result.sent) {
    // Let them try again straight away rather than waiting out the cooldown.
    await admin
      .from('email_otps')
      .update({ last_sent_at: new Date(now - RESEND_AFTER_S * 1000).toISOString() })
      .eq('user_id', user.id);
    console.error('[verify-email] send failed:', result.error || result.reason);
    return { error: 'We could not send the email right now. Please try again in a minute.' };
  }

  return { sent: true, email: user.email, retryIn: RESEND_AFTER_S };
}

/** Checks the typed code; on success the account can see prices everywhere. */
export async function confirmVerificationCode(_prevState, formData) {
  const user = await currentUser();
  if (!user) return { error: 'Please sign in first.' };

  const code = String(formData.get('code') || '').replace(/\D/g, '');
  if (code.length !== 6) return { error: 'Enter the 6-digit code from the email.' };

  const admin = createAdminClient();
  if (!admin) return { error: NOT_READY };

  const { data: row } = await admin.from('email_otps').select('*').eq('user_id', user.id).maybeSingle();

  if (!row || row.email?.toLowerCase() !== user.email?.toLowerCase()) {
    return { error: 'Ask for a new code first.' };
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { error: 'This code has expired. Ask for a new one.' };
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return { error: 'Too many wrong attempts. Ask for a new code.' };
  }

  if (!sameHash(row.code_hash, hashCode(user.id, code))) {
    const attempts = row.attempts + 1;
    await admin.from('email_otps').update({ attempts }).eq('user_id', user.id);
    return { error: 'That code is not right.', triesLeft: Math.max(0, MAX_ATTEMPTS - attempts) };
  }

  // upsert: an account created before the profile trigger may have no row yet.
  const { error } = await admin
    .from('profiles')
    .upsert(
      { id: user.id, email_verified_at: new Date().toISOString(), verified_email: user.email },
      { onConflict: 'id' }
    );
  if (error) {
    console.error('[verify-email] could not mark verified:', error.message);
    return { error: NOT_READY };
  }

  await admin.from('email_otps').delete().eq('user_id', user.id);

  revalidatePath('/', 'layout');
  return { verified: true };
}
