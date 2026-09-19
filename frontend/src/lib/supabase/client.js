'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for the browser. Reads the session from the cookies that the
 * server writes, so client and server always agree on who is signed in.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
