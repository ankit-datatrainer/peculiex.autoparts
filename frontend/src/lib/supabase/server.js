import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
);

/**
 * Supabase client for server components, route handlers and server actions.
 * Every query runs as the signed-in user, so row level security does the
 * authorisation work rather than hand-rolled checks.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a server component, where cookies are read-only.
            // middleware.js refreshes the session instead.
          }
        }
      }
    }
  );
}

/** The signed-in user plus their profile row, or nulls when signed out. */
export async function getSessionUser() {
  if (!isSupabaseConfigured) return { user: null, profile: null };

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role')
    .eq('id', user.id)
    .maybeSingle();

  return { user, profile: profile || null };
}

export async function isAdmin() {
  const { profile } = await getSessionUser();
  return profile?.role === 'admin';
}
