import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED = ['/account', '/checkout'];
const ADMIN_ONLY = ['/admin'];

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;

  // Health probe and static paths must never be blocked or trigger auth overhead
  if (path === '/api/health' || path.startsWith('/api/health')) {
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase configured, let public storefront work; gated areas redirect
  if (!url || !key || url.includes('your-project')) {
    const needsAuth = PROTECTED.some((p) => path.startsWith(p));
    const needsAdmin = ADMIN_ONLY.some((p) => path.startsWith(p));
    if (needsAuth || needsAdmin) {
      const signIn = request.nextUrl.clone();
      signIn.pathname = '/signin';
      signIn.searchParams.set('next', path);
      return NextResponse.redirect(signIn);
    }
    return response;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    });

    // Refreshes an expiring session and rewrites the auth cookies.
    const {
      data: { user } = {}
    } = await supabase.auth.getUser();

    const needsAuth = PROTECTED.some((p) => path.startsWith(p));
    const needsAdmin = ADMIN_ONLY.some((p) => path.startsWith(p));

    if ((needsAuth || needsAdmin) && !user) {
      const signIn = request.nextUrl.clone();
      signIn.pathname = '/signin';
      signIn.searchParams.set('next', path);
      return NextResponse.redirect(signIn);
    }

    if (needsAdmin && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        const home = request.nextUrl.clone();
        home.pathname = '/account';
        home.searchParams.set('denied', 'admin');
        return NextResponse.redirect(home);
      }
    }
  } catch (err) {
    console.error('Middleware auth check error:', err?.message || err);
    const needsAuth = PROTECTED.some((p) => path.startsWith(p));
    const needsAdmin = ADMIN_ONLY.some((p) => path.startsWith(p));
    if (needsAuth || needsAdmin) {
      const signIn = request.nextUrl.clone();
      signIn.pathname = '/signin';
      signIn.searchParams.set('next', path);
      return NextResponse.redirect(signIn);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)']
};
