'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const menuLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', adminOnly: false },
  { href: '/donors', label: 'Donors', icon: '👥', adminOnly: false },
  { href: '/donations', label: 'Donations', icon: '💝', adminOnly: false },
  { href: '/campaigns', label: 'Campaigns', icon: '📢', adminOnly: false },
  { href: '/events', label: 'Events', icon: '🎉', adminOnly: false },
  { href: '/follow-ups', label: 'Follow-ups', icon: '📋', adminOnly: false },
  { href: '/evidence', label: 'Evidence', icon: '📁', adminOnly: true },
  { href: '/reflection', label: 'Reflection', icon: '💭', adminOnly: true },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState('loading')
  const router = useRouter()

  // Fetch session on mount and when pathname changes (after login redirect)
  useEffect(() => {
    let mounted = true
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include' // Ensure cookies are sent
        })
        if (!mounted) return
        if (!res.ok) {
          setSession(null)
          setStatus('unauthenticated')
          return
        }
        const data = await res.json()
        if (data && data.user) {
          setSession({ user: data.user })
          setStatus('authenticated')
        } else {
          setSession(null)
          setStatus('unauthenticated')
        }
      } catch (e) {
        if (mounted) {
          setSession(null)
          setStatus('unauthenticated')
        }
      }
    }
    
    fetchSession()
    return () => { mounted = false }
  }, [pathname]) // Re-fetch when pathname changes (after navigation/login)

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setSession(null)
    setStatus('unauthenticated')
    router.push('/auth/login')
  }

  const handleHomeClick = async (e) => {
    e.preventDefault()
    if (status === 'authenticated') {
      // Log out when going home if authenticated
      await fetch('/api/auth/logout', { method: 'POST' })
      setSession(null)
      setStatus('unauthenticated')
    }
    router.push('/')
  }

  // Filter menu links based on user role
  const filteredMenuLinks = session?.user?.role === 'ADMIN'
    ? menuLinks
    : menuLinks.filter(link => !link.adminOnly)

  const isAuthPage = pathname.startsWith('/auth')

  // Don't show navigation on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <>
      <style jsx global>{`
        .hamburger-nav {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          overflow-x: hidden;
        }

        .hamburger-nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          position: relative;
        }

        .hamburger-nav-brand {
          z-index: 1001;
        }

        .hamburger-brand-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: white;
          font-weight: 700;
          font-size: 1.5rem;
          transition: transform 0.2s ease;
        }

        .hamburger-brand-link:hover {
          transform: scale(1.05);
        }

        .hamburger-brand-icon {
          font-size: 1.8rem;
        }

        .hamburger-right-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .auth-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-sizing: border-box;
        }

        .auth-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: white;
          transform: translateY(-2px);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 0.85rem;
        }

        .user-role {
          padding: 0.25rem 0.625rem;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .hamburger-dropdown {
          position: relative;
        }

        .hamburger-btn {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 2rem;
          height: 2rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
          transition: transform 0.3s ease;
        }

        .hamburger-btn:hover {
          transform: scale(1.1);
        }

        .hamburger-btn span {
          width: 2rem;
          height: 0.25rem;
          background: white;
          border-radius: 10px;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .hamburger-btn.open span:nth-child(1) {
          transform: rotate(45deg) translate(0.5rem, 0.5rem);
        }

        .hamburger-btn.open span:nth-child(2) {
          opacity: 0;
          transform: translateX(20px);
        }

        .hamburger-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(0.5rem, -0.5rem);
        }

        .hamburger-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          width: 280px;
          max-height: 0;
          overflow: hidden;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          transition: max-height 0.4s ease, opacity 0.3s ease;
          opacity: 0;
          z-index: 999;
        }

        .hamburger-menu.open {
          max-height: 500px;
          opacity: 1;
        }

        .hamburger-list {
          list-style: none;
          padding: 0.75rem 0;
          margin: 0;
        }

        .hamburger-list li {
          opacity: 0;
          transform: translateY(-10px);
          animation: none;
        }

        .hamburger-menu.open .hamburger-list li {
          animation: slideDownNav 0.3s ease forwards;
        }

        .hamburger-menu.open .hamburger-list li:nth-child(1) { animation-delay: 0.05s; }
        .hamburger-menu.open .hamburger-list li:nth-child(2) { animation-delay: 0.1s; }
        .hamburger-menu.open .hamburger-list li:nth-child(3) { animation-delay: 0.15s; }
        .hamburger-menu.open .hamburger-list li:nth-child(4) { animation-delay: 0.2s; }
        .hamburger-menu.open .hamburger-list li:nth-child(5) { animation-delay: 0.25s; }
        .hamburger-menu.open .hamburger-list li:nth-child(6) { animation-delay: 0.3s; }
        .hamburger-menu.open .hamburger-list li:nth-child(7) { animation-delay: 0.35s; }

        @keyframes slideDownNav {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hamburger-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          color: #374151;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .hamburger-nav-link:hover {
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
          border-left-color: #667eea;
          color: #667eea;
        }

        .hamburger-nav-link.active {
          background: linear-gradient(90deg, #ede9fe 0%, #ddd6fe 100%);
          border-left-color: #764ba2;
          color: #764ba2;
          font-weight: 600;
        }

        .hamburger-nav-icon {
          font-size: 1.25rem;
          min-width: 1.25rem;
        }

        .hamburger-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: transparent;
          z-index: 998;
        }

        @media (max-width: 768px) {
          .hamburger-brand-link {
            font-size: 1.1rem;
            gap: 0.4rem;
          }
          .hamburger-brand-icon {
            font-size: 1.4rem;
          }
          .auth-btn, .user-info {
            font-size: 0.8rem;
          }
          .user-role {
            display: none;
          }
          .hamburger-nav-container { padding: 0 12px; height: auto; }
          .hamburger-right-section { gap: 0.5rem; }
        }

        @media (max-width: 480px) {
          .hamburger-menu {
            /* make menu fit within the viewport */
            width: min(320px, calc(100% - 24px));
            right: 12px;
          }
          .auth-btn {
            padding: 0.35rem 0.75rem;
            white-space: normal;
            max-width: 160px;
          }
          .hamburger-nav-container { padding: 0 8px; }
        }
      `}</style>

      <nav className="hamburger-nav">
        <div className="hamburger-nav-container">
          <div className="hamburger-nav-brand">
            <Link href="/" className="hamburger-brand-link" onClick={handleHomeClick}>
              <span className="hamburger-brand-icon">🤝</span>
              <span>DonorConnect</span>
            </Link>
          </div>

          <div className="hamburger-right-section">
            {status === 'loading' ? null : status === 'authenticated' ? (
              <>
                <div className="user-info">
                  <span>{session?.user?.email ?? 'Unknown'}</span>
                  <span className="user-role">{session?.user?.role ?? ''}</span>
                </div>
                <button onClick={handleLogout} className="auth-btn">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="auth-btn">
                Log in / Sign up
              </Link>
            )}

            <div className="hamburger-dropdown">
              <button 
                className={`hamburger-btn ${isOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
                <ul className="hamburger-list">
                  {filteredMenuLinks.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className={`hamburger-nav-link ${isActive(link.href) ? 'active' : ''}`}
                        onClick={closeMenu}
                      >
                        <span className="hamburger-nav-icon">{link.icon}</span>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {isOpen && <div className="hamburger-overlay" onClick={closeMenu}></div>}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
