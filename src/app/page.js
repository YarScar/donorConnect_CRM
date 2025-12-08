import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>donorConnect</h1>
        <p className="tagline">Lightweight CRM for Nonprofits</p>
      </header>

      <Navigation />

      <main className="main">
        <div className="dashboard-grid">
          <Link href="/donors" className="dashboard-card">
            <h2>Donors</h2>
            <p>Manage donor information and giving history</p>
          </Link>

          <Link href="/donations" className="dashboard-card">
            <h2>Donations</h2>
            <p>Track donations and payment details</p>
          </Link>

          <Link href="/campaigns" className="dashboard-card">
            <h2>Campaigns</h2>
            <p>Organize fundraising campaigns</p>
          </Link>

          <Link href="/events" className="dashboard-card">
            <h2>Events</h2>
            <p>Manage nonprofit events</p>
          </Link>

          <Link href="/follow-ups" className="dashboard-card">
            <h2>Follow-ups</h2>
            <p>Track tasks and reminders</p>
          </Link>

          <Link href="/reports" className="dashboard-card">
            <h2>Reports</h2>
            <p>Generate donation reports</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
