import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

/** Liveness/readiness probe for Docker, nginx and uptime monitors. */
export async function GET() {
  let database = 'not-configured';

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
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
}
