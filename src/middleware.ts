/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

const protectedRoutes = ['/admin', '/drafts'];

const adminRoutes = ['/admin'];

const publicRoutes = ['/', '/posts', '/tags', '/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access-token')?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  if (!accessToken && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && isProtectedRoute) {
    try {
      const payload = await verifyAccessToken(accessToken);

      if (!payload) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
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
