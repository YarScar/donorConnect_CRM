import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'

export async function checkAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return session
}

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  return session
}

export function canAccessRoute(role, pathname) {
  const adminOnlyRoutes = ['/evidence', '/reflection']
  
  if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
    return role === 'ADMIN'
  }
  
  return true
}
