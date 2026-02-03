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
  
  // Create response with security headers
  const response = matches ? null : NextResponse.next()
  
  if (!matches) {
    // Add security headers for all requests
    const headers = response.headers
    
    // Prevent clickjacking
    headers.set('X-Frame-Options', 'DENY')
    
    // Prevent MIME type sniffing
    headers.set('X-Content-Type-Options', 'nosniff')
    
    // Enable XSS protection
    headers.set('X-XSS-Protection', '1; mode=block')
    
    // Referrer policy
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Permissions policy
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    return response
  }

  // Simple presence check for token cookie; detailed role checks happen in server pages
  const token = request.cookies.get('token')?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Add security headers for protected routes too
  const protectedResponse = NextResponse.next()
  const headers = protectedResponse.headers
  
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return protectedResponse
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
