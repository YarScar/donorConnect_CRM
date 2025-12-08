'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link 
            href="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            href="/donors" 
            className={`nav-link ${isActive('/donors') ? 'active' : ''}`}
          >
            Donors
          </Link>
        </li>
        <li>
          <Link 
            href="/donations" 
            className={`nav-link ${isActive('/donations') ? 'active' : ''}`}
          >
            Donations
          </Link>
        </li>
        <li>
          <Link 
            href="/campaigns" 
            className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`}
          >
            Campaigns
          </Link>
        </li>
        <li>
          <Link 
            href="/events" 
            className={`nav-link ${isActive('/events') ? 'active' : ''}`}
          >
            Events
          </Link>
        </li>
        <li>
          <Link 
            href="/follow-ups" 
            className={`nav-link ${isActive('/follow-ups') ? 'active' : ''}`}
          >
            Follow-ups
          </Link>
        </li>
      </ul>
    </nav>
  )
}
