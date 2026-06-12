import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/auth/callback'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths and Next.js internals
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Token is stored client-side in localStorage — we can't read it here.
  // The dashboard layout handles the redirect via useEffect/useAuth.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon).*)'],
};
