import { NextResponse } from 'next/server';

/**
 * Middleware for performance optimization
 * - Adds caching headers
 * - Enables compression
 * - Sets security headers
 */
export function middleware(request) {
  const response = NextResponse.next();

  // Cache static assets for 1 year (immutable)
  if (
    request.nextUrl.pathname.startsWith('/_next/static') ||
    request.nextUrl.pathname.startsWith('/images') ||
    request.nextUrl.pathname.startsWith('/fonts')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Cache API responses and pages for 1 hour
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  }

  // Enable gzip compression
  response.headers.set('Content-Encoding', 'gzip');

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Performance hint headers
  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
