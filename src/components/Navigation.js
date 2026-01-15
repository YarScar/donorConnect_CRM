'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/" className="brand-link">
            DonorConnect CRM
          </Link>
        </div>
        
        <ul className="nav-list">
          <li>
            <Link 
              href="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              🏠 Home
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/donors" 
              className={`nav-link ${isActive('/donors') || pathname.startsWith('/donors') ? 'active' : ''}`}
            >
              👥 Donors
            </Link>
          </li>
          <li>
            <Link 
              href="/donations" 
              className={`nav-link ${isActive('/donations') || pathname.startsWith('/donations') ? 'active' : ''}`}
            >
              💝 Donations
            </Link>
          </li>
          <li>
            <Link 
              href="/campaigns" 
              className={`nav-link ${isActive('/campaigns') || pathname.startsWith('/campaigns') ? 'active' : ''}`}
            >
              📢 Campaigns
            </Link>
          </li>
          <li>
            <Link 
              href="/events" 
              className={`nav-link ${isActive('/events') || pathname.startsWith('/events') ? 'active' : ''}`}
            >
              🎪 Events
            </Link>
          </li>
          <li>
            <Link 
              href="/follow-ups" 
              className={`nav-link ${isActive('/follow-ups') || pathname.startsWith('/follow-ups') ? 'active' : ''}`}
            >
              📋 Follow-ups
            </Link>
          </li>
        </ul>

        <div className="nav-secondary">
          <div className="dropdown">
            <button className="dropdown-toggle">
              📚 Resources ▼
            </button>
            <div className="dropdown-menu">
              <Link href="/about" className="dropdown-link">
                📖 About / Problem
              </Link>
              <Link href="/why-donorconnect" className="dropdown-link">
                🎯 Why DonorConnect
              </Link>
              <Link href="/ai-policy" className="dropdown-link">
                🤖 AI Policy
              </Link>
              <Link href="/evidence" className="dropdown-link">
                📋 Evidence / Rubric
              </Link>
              <Link href="/reflection" className="dropdown-link">
                💭 Reflection
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 8px;
          margin: 1rem 0 2rem 0;
          overflow: hidden;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .nav-brand {
          font-weight: 700;
          font-size: 1.2rem;
        }

        .brand-link {
          color: #007bff;
          text-decoration: none;
        }

        .brand-link:hover {
          color: #0056b3;
        }

        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0;
          flex-wrap: wrap;
        }

        .nav-link {
          display: block;
          padding: 1rem 1.5rem;
          text-decoration: none;
          color: #495057;
          font-weight: 500;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
        }

        .nav-link:hover {
          color: #007bff;
          background-color: #f8f9fa;
        }

        .nav-link.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background-color: #f8f9fa;
        }

        .nav-secondary {
          position: relative;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-toggle {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .dropdown-toggle:hover {
          background: #5a6268;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          min-width: 200px;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
        }

        .dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-link {
          display: block;
          padding: 0.75rem 1rem;
          color: #495057;
          text-decoration: none;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f8f9fa;
        }

        .dropdown-link:last-child {
          border-bottom: none;
        }

        .dropdown-link:hover {
          background-color: #f8f9fa;
          color: #007bff;
        }

        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            align-items: stretch;
          }

          .nav-list {
            justify-content: center;
            flex-wrap: wrap;
          }

          .nav-link {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .nav-secondary {
            align-self: center;
          }

          .dropdown-menu {
            left: 50%;
            transform: translateX(-50%) translateY(-10px);
            right: auto;
          }

          .dropdown:hover .dropdown-menu {
            transform: translateX(-50%) translateY(0);
          }
        }

        @media (max-width: 480px) {
          .nav-list {
            flex-direction: column;
            width: 100%;
          }

          .nav-link {
            text-align: center;
            border-bottom: 1px solid #e9ecef;
            border-radius: 0;
          }

          .nav-link.active {
            border-bottom: 1px solid #007bff;
            border-left: 3px solid #007bff;
          }
        }
      `}</style>
    </nav>
  )
}
