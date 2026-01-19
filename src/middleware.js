import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  // Only protect certain app routes; allow assets/public
  const protectedPaths = [
    '/dashboard',
    '/donors',
    '/donations',
    '/campaigns',
    '/events',
    '/follow-ups',
    '/evidence',
    '/reflection',
  ]

  const matches = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))
  if (!matches) return NextResponse.next()

  // Simple presence check for token cookie; detailed role checks happen in server pages
  const token = request.cookies.get('token')?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/donors/:path*',
    '/donations/:path*',
    '/campaigns/:path*',
    '/events/:path*',
    '/follow-ups/:path*',
    '/evidence/:path*',
    '/reflection/:path*',
  ],
}
