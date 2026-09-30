import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client for the few server tasks row level security must not
 * allow a signed-in customer to do for themselves — issuing and checking
 * email verification codes, and marking an email verified.
 *
 * Never import this from a client component: the key bypasses every policy.
 */
export const isServiceRoleConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export function createAdminClient() {
  if (!isServiceRoleConfigured) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
