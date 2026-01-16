export { default } from 'next-auth/middleware'

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
  ]
}
