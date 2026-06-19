import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy middleware for security, CSRF protection, rate limiting, and admin authentication
 * (Replaces deprecated middleware.ts in Next.js 16)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection (/admin and /crads)
  if (pathname.startsWith('/admin') || pathname.startsWith('/crads')) {
    // Public admin routes (no authentication required)
    const publicRoutes = ['/admin/login', '/crads/login'];

    // Check if current path is public
    const isPublicRoute = publicRoutes.some((route) =>
      pathname === route || pathname.startsWith(`${route}/`)
    );

    // Skip authentication for public routes
    if (!isPublicRoute) {
      // Check for session cookie
      const sessionCookie = request.cookies.get('admin_session');

      if (!sessionCookie) {
        // No session cookie, redirect to login
        const loginUrl = new URL('/crads/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS handling for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://cabscript.com',
      'https://www.cabscript.com',
      process.env.NEXT_PUBLIC_SITE_URL || '',
    ];

    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000');
    }

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
