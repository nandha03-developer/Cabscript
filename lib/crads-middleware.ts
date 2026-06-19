/**
 * Admin Route Middleware
 * Protects /crads routes and redirects unauthorized users
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public admin routes (no authentication required)
  const publicRoutes = ['/crads/login'];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Skip authentication for public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('admin_session');

  if (!sessionCookie) {
    // No session cookie, redirect to login
    const loginUrl = new URL('/crads/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists, allow access
  return NextResponse.next();
}

/**
 * Check if route is admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/crads');
}
