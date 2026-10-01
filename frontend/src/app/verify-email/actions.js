'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { createAdminClient } from '../../lib/supabase/admin';
import { emailConfigured, sendVerificationEmail } from '../../lib/email';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../lib/translations';
import { NOT_READY, RESEND_AFTER_S, issueCode, releaseCooldown, checkCode, markVerified } from '../../lib/otp';

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

  const issued = await issueCode(admin, user, 'verify');
  if (issued.error) return issued;

  const result = await sendVerificationEmail({ to: user.email, code: issued.code, lang: mailLanguage() });
  if (!result.sent) {
    await releaseCooldown(admin, user.id);
    console.error('[verify-email] send failed:', result.error || result.reason);
    return { error: 'We could not send the email right now. Please try again in a minute.' };
  }

  return { sent: true, email: user.email, retryIn: RESEND_AFTER_S };
}

/** Checks the typed code; on success the account can see prices everywhere. */
export async function confirmVerificationCode(_prevState, formData) {
  const user = await currentUser();
  if (!user) return { error: 'Please sign in first.' };

  const admin = createAdminClient();
  if (!admin) return { error: NOT_READY };

  const checked = await checkCode(admin, user, 'verify', formData.get('code'));
  if (!checked.ok) return checked;

  if (!(await markVerified(admin, user))) return { error: NOT_READY };

  revalidatePath('/', 'layout');
  return { verified: true };
}
