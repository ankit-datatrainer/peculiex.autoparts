import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/** Liveness/readiness probe for Docker, nginx and uptime monitors. */
export async function GET() {
  try {
    let database = 'not-configured';

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key && !url.includes('your-project')) {
      try {
        const supabase = createSupabaseClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
        const { error } = await supabase.from('brands').select('id').limit(1);
        database = error ? `error: ${error.message}` : 'ok';
      } catch (err) {
        database = `error: ${err.message}`;
      }
    }

    const healthy = database === 'ok' || database === 'not-configured';

    return NextResponse.json(
      {
        status: healthy ? 'ok' : 'degraded',
        service: 'motomart-web',
        database,
        timestamp: new Date().toISOString()
      },
      { status: healthy ? 200 : 503 }
    );
  } catch (globalErr) {
    return NextResponse.json(
      {
        status: 'error',
        service: 'motomart-web',
        error: globalErr?.message || 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
