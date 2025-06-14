/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access-token')?.value;

  const isApiRoute = pathname.startsWith('/api');

  const protectedApiRoutes = ['/api/articles'];
  const protectedAppRoutes = ['/admin', '/drafts', '/account'];
  const publicRoutes = ['/', '/posts', '/tags', '/login'];
  const adminRoutes = ['/admin'];

  const isProtectedApi = protectedApiRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isProtectedApp = protectedAppRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  if (!isApiRoute && isPublicRoute && !isProtectedApp) {
    return NextResponse.next();
  }

  if (!accessToken && (isProtectedApp || isProtectedApi)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('expired', 'true');

    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && (isProtectedApp || isProtectedApi)) {
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
