'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>DonorConnect CRM</h1>
        <p className="tagline">Intelligent CRM for Nonprofits</p>
      </header>

      <Navigation />

      <main className="main">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Transform Your Nonprofit's Donor Management</h2>
            <div className="problem-solution">
              <div className="problem-statement">
                <h3>The Problem</h3>
                <p>Nonprofits struggle to track donor information and donation history in one clear, organized system, leading to missed follow-ups, poor reporting, and lost funding opportunities.</p>
              </div>
              <div className="solution-statement">
                <h3>Our Solution</h3>
                <p>DonorConnect provides an intelligent, all-in-one platform that centralizes donor management, tracks donation history, and uses AI to enhance donor relationships and planning decisions.</p>
              </div>
            </div>
            <div className="cta-section">
              <Link href="/dashboard" className="cta-button primary">
                Start Managing Donors
              </Link>
              <Link href="/about" className="cta-button secondary">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section className="features-grid">
          <div className="dashboard-grid">
            <Link href="/dashboard" className="dashboard-card featured">
              <h2>📊 Dashboard</h2>
              <p>View comprehensive analytics and donor insights</p>
            </Link>

            <Link href="/donors" className="dashboard-card">
              <h2>👥 Donors</h2>
              <p>Manage donor information and giving history</p>
            </Link>

            <Link href="/donations" className="dashboard-card">
              <h2>💝 Donations</h2>
              <p>Track donations and payment details</p>
            </Link>

            <Link href="/campaigns" className="dashboard-card">
              <h2>📢 Campaigns</h2>
              <p>Organize fundraising campaigns</p>
            </Link>

            <Link href="/events" className="dashboard-card">
              <h2>🎪 Events</h2>
              <p>Plan and manage fundraising events</p>
            </Link>

            <Link href="/follow-ups" className="dashboard-card">
              <h2>📋 Follow-ups</h2>
              <p>Schedule and track donor communications</p>
            </Link>
          </div>
        </section>

        <section className="ai-feature-highlight">
          <div className="ai-content">
            <h2>🤖 AI-Powered Insights</h2>
            <p>Our intelligent system analyzes donor patterns, suggests optimal follow-up strategies, and provides actionable insights to maximize your fundraising potential.</p>
            <Link href="/ai-policy" className="learn-more-link">
              Learn about our AI approach →
            </Link>
          </div>
        </section>
      </main>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          border-radius: 12px;
          margin: 2rem 0;
          text-align: center;
        }

        .hero-content h2 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          font-weight: 700;
        }

        .problem-solution {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
          text-align: left;
        }

        .problem-statement, .solution-statement {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 8px;
        }

        .problem-statement h3, .solution-statement h3 {
          margin-bottom: 1rem;
          color: #ffd700;
        }

        .cta-section {
          margin-top: 2rem;
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 2rem;
          margin: 0 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cta-button.primary {
          background: #28a745;
          color: white;
        }

        .cta-button.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .features-grid {
          margin: 3rem 0;
        }

        .dashboard-card.featured {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .ai-feature-highlight {
          background: #f8f9fa;
          padding: 3rem 2rem;
          border-radius: 12px;
          text-align: center;
          border-left: 4px solid #6f42c1;
        }

        .ai-content h2 {
          color: #6f42c1;
          margin-bottom: 1rem;
        }

        .learn-more-link {
          color: #6f42c1;
          text-decoration: none;
          font-weight: 600;
        }

        .learn-more-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .problem-solution {
            grid-template-columns: 1fr;
          }
          
          .hero-content h2 {
            font-size: 2rem;
          }
          
          .cta-button {
            display: block;
            margin: 0.5rem 0;
          }
        }
      `}</style>
    </div>
  )
}
