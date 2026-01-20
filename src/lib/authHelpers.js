import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

function getSessionFromCookie() {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get('token')
  if (!tokenCookie) return null
  const token = tokenCookie.value
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return payload
  } catch (err) {
    return null
  }
}

export async function checkAuth() {
  const session = getSessionFromCookie()
  if (!session) redirect('/auth/login')
  return session
}

export async function checkAdminAuth() {
  const session = getSessionFromCookie()
  if (!session) redirect('/auth/login')
  if (session.role !== 'ADMIN') redirect('/dashboard')
  return session
}

export function canAccessRoute(role, pathname) {
  const adminOnlyRoutes = ['/evidence', '/reflection']
  if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
    return role === 'ADMIN'
  }
  return true
}
