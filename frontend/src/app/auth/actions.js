'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';

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
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

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

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } }
  });

  if (error) return { error: error.message };

  // With email confirmation switched on there is no session yet.
  if (!data.session) {
    return { notice: 'Check your inbox to confirm your email, then sign in.' };
  }

  revalidatePath('/', 'layout');
  redirect(next);
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
