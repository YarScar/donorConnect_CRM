'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const menuLinks = [
  { href: '/donors', label: 'Donors', icon: '👥' },
  { href: '/donations', label: 'Donations', icon: '💝' },
  { href: '/campaigns', label: 'Campaigns', icon: '📢' },
  { href: '/events', label: 'Events', icon: '🎉' },
  { href: '/follow-ups', label: 'Follow-ups', icon: '📋' },
  { href: '/evidence', label: 'Evidence', icon: '📁' },
  { href: '/reflection', label: 'Reflection', icon: '💭' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <style jsx global>{`
        .hamburger-nav {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .hamburger-nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          position: relative;
        }

        .hamburger-left-section {
          display: flex;
          align-items: center;
          gap: 2rem;
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

        .dashboard-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          color: white;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .dashboard-link:hover {
          background: rgba(255, 255, 255, 0.2);
          border-bottom-color: white;
        }

        .dashboard-link.active {
          background: rgba(255, 255, 255, 0.25);
          border-bottom-color: #fbbf24;
          font-weight: 600;
        }

        .dashboard-icon {
          font-size: 1.2rem;
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
            font-size: 1.2rem;
          }
          .hamburger-brand-icon {
            font-size: 1.5rem;
          }
          .dashboard-link {
            font-size: 0.9rem;
            padding: 0.4rem 1rem;
          }
          .dashboard-icon {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hamburger-left-section {
            gap: 1rem;
          }
          .hamburger-menu {
            width: 260px;
          }
        }
      `}</style>

      <nav className="hamburger-nav">
        <div className="hamburger-nav-container">
          <div className="hamburger-left-section">
            <div className="hamburger-nav-brand">
              <Link href="/" className="hamburger-brand-link">
                <span className="hamburger-brand-icon">🤝</span>
                <span>DonorConnect</span>
              </Link>
            </div>

            <Link 
              href="/dashboard" 
              className={`dashboard-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <span className="dashboard-icon">📊</span>
              <span>Dashboard</span>
            </Link>
          </div>

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
                {menuLinks.map((link) => (
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
      </nav>
    </>
  )
}
