// =============================================================================
// ONE-TIME EMAIL CODES (server only)
//
// Used for two things: verifying a customer's email (which also unlocks
// prices) and resetting a forgotten password. Codes live hashed in the
// email_otps table, which only the service-role client can read. The purpose
// is part of the hash, so a verification code can never reset a password.
// =============================================================================

import crypto from 'node:crypto';

export const CODE_TTL_MS = 10 * 60 * 1000; // a code works for 10 minutes
export const RESEND_AFTER_S = 45; // wait between two codes
export const MAX_SENDS_PER_HOUR = 5;
export const MAX_ATTEMPTS = 5; // wrong guesses before the code is burned

export const NOT_READY = 'Email verification is not set up on this server yet. Please contact us.';

export function hashCode(purpose, userId, code) {
  return crypto
    .createHash('sha256')
    .update(`${purpose}:${userId}:${code}:${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`)
    .digest('hex');
}

function sameHash(a, b) {
  const x = Buffer.from(String(a || ''), 'hex');
  const y = Buffer.from(String(b || ''), 'hex');
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
}

/** Finds an auth user by email (the admin API has no direct lookup). */
export async function findUserByEmail(admin, email) {
  const wanted = String(email || '').trim().toLowerCase();
  if (!wanted) return null;
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return null;
    const users = data?.users || [];
    const hit = users.find((u) => (u.email || '').toLowerCase() === wanted);
    if (hit) return hit;
    if (users.length < 1000) return null;
  }
  return null;
}

/**
 * Creates and stores a fresh code for this user, honouring the resend and
 * hourly limits. Returns { code } or { error, retryIn }.
 */
export async function issueCode(admin, user, purpose) {
  const { data: existing, error: readError } = await admin
    .from('email_otps')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (readError) {
    console.error('[otp] email_otps unavailable — has migration 0003 run?', readError.message);
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
  if (sentCount > MAX_SENDS_PER_HOUR) return { error: 'Too many codes requested. Please try again in an hour.' };

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const { error } = await admin.from('email_otps').upsert(
    {
      user_id: user.id,
      email: user.email,
      code_hash: hashCode(purpose, user.id, code),
      expires_at: new Date(now + CODE_TTL_MS).toISOString(),
      attempts: 0,
      sent_count: sentCount,
      window_start: windowFresh ? existing.window_start : new Date(now).toISOString(),
      last_sent_at: new Date(now).toISOString()
    },
    { onConflict: 'user_id' }
  );
  if (error) {
    console.error('[otp] could not save code:', error.message);
    return { error: NOT_READY };
  }
  return { code };
}

/** After a failed send, let the customer try again straight away. */
export async function releaseCooldown(admin, userId) {
  await admin
    .from('email_otps')
    .update({ last_sent_at: new Date(Date.now() - RESEND_AFTER_S * 1000).toISOString() })
    .eq('user_id', userId);
}

/** Checks a typed code. Returns { ok: true } (and burns it) or { error, triesLeft? }. */
export async function checkCode(admin, user, purpose, rawCode) {
  const code = String(rawCode || '').replace(/\D/g, '');
  if (code.length !== 6) return { error: 'Enter the 6-digit code from the email.' };

  const { data: row } = await admin.from('email_otps').select('*').eq('user_id', user.id).maybeSingle();
  if (!row || row.email?.toLowerCase() !== user.email?.toLowerCase()) return { error: 'Ask for a new code first.' };
  if (new Date(row.expires_at).getTime() < Date.now()) return { error: 'This code has expired. Ask for a new one.' };
  if (row.attempts >= MAX_ATTEMPTS) return { error: 'Too many wrong attempts. Ask for a new code.' };

  if (!sameHash(row.code_hash, hashCode(purpose, user.id, code))) {
    const attempts = row.attempts + 1;
    await admin.from('email_otps').update({ attempts }).eq('user_id', user.id);
    return { error: 'That code is not right.', triesLeft: Math.max(0, MAX_ATTEMPTS - attempts) };
  }

  await admin.from('email_otps').delete().eq('user_id', user.id);
  return { ok: true };
}

/** Marks the account's current email verified (unlocks prices). */
export async function markVerified(admin, user) {
  const { error } = await admin
    .from('profiles')
    .upsert(
      { id: user.id, email_verified_at: new Date().toISOString(), verified_email: user.email },
      { onConflict: 'id' }
    );
  if (error) console.error('[otp] could not mark verified:', error.message);
  return !error;
}
