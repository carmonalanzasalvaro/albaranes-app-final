import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('jwt')?.value
  const isAuth = !!token
  const path = request.nextUrl.pathname
  const isPendingVerification = request.cookies.get('pendingVerification')?.value === 'true'

  console.log('Middleware triggered for path:', path)

  if (path === '/') {
    return NextResponse.redirect(new URL('/register', request.url))
  }

  const isPublicPath =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    (path.startsWith('/validate') && isPendingVerification)

  if (isAuth && !isPendingVerification && isPublicPath) {
    return NextResponse.redirect(new URL('/clients', request.url))
  }

  if (!isAuth && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/clients/:path*',
    '/projects/:path*',
    '/delivery-notes/:path*',
    '/register',
    '/login',
    '/validate',
  ],
}
