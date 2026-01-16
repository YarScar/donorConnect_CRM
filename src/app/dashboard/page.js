'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateRiskLevel = (donor) => {
    const daysSinceLastDonation = donor.donations && donor.donations.length > 0 
      ? Math.floor((new Date() - new Date(donor.donations[0].donationDate)) / (1000 * 60 * 60 * 24))
      : 365

    if (daysSinceLastDonation < 90) return { level: 'Low', color: '#28a745' }
    if (daysSinceLastDonation < 180) return { level: 'Medium', color: '#ffc107' }
    return { level: 'High', color: '#dc3545' }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1>📊 Dashboard</h1>
        <p className="tagline">Your Nonprofit's Performance Overview</p>
      </header>

      <main className="main">
        {/* Summary Cards */}
        <section className="summary-section">
          <div className="summary-grid">
            <div className="summary-card primary">
              <div className="summary-icon">👥</div>
              <div className="summary-content">
                <h3>Total Donors</h3>
                <div className="summary-number">{dashboardData?.summary?.totalDonors || 0}</div>
                <Link href="/donors" className="summary-link">Manage Donors →</Link>
              </div>
            </div>

            <div className="summary-card success">
              <div className="summary-icon">💝</div>
              <div className="summary-content">
                <h3>Total Raised</h3>
                <div className="summary-number">{formatCurrency(dashboardData?.summary?.totalAmount || 0)}</div>
                <div className="summary-subtitle">{dashboardData?.summary?.totalDonations || 0} donations</div>
              </div>
            </div>

            <div className="summary-card info">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>Average Gift</h3>
                <div className="summary-number">{formatCurrency(dashboardData?.summary?.averageGift || 0)}</div>
                <Link href="/donations" className="summary-link">View Donations →</Link>
              </div>
            </div>

            <div className="summary-card warning">
              <div className="summary-icon">🎯</div>
              <div className="summary-content">
                <h3>Active Campaigns</h3>
                <div className="summary-number">{dashboardData?.summary?.totalCampaigns || 0}</div>
                <Link href="/campaigns" className="summary-link">Manage Campaigns →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity and Top Donors */}
        <section className="content-grid">
          <div className="dashboard-section">
            <h2>Recent Donations</h2>
            <div className="recent-donations">
              {dashboardData?.recentDonations?.length > 0 ? (
                dashboardData.recentDonations.map((donation) => (
                  <div key={donation.id} className="recent-donation-item">
                    <div className="donation-info">
                      <div className="donor-name">
                        {donation.donor.firstName} {donation.donor.lastName}
                      </div>
                      <div className="donation-details">
                        {formatCurrency(donation.amount)} • {formatDate(donation.donationDate)}
                        {donation.campaign && (
                          <span className="campaign-tag">{donation.campaign.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="donation-amount">
                      {formatCurrency(donation.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No recent donations</p>
                  <Link href="/donations/new" className="cta-button secondary">
                    Record First Donation
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Top Donors</h2>
            <div className="top-donors">
              {dashboardData?.topDonors?.length > 0 ? (
                dashboardData.topDonors.map((donor, index) => {
                  const risk = calculateRiskLevel(donor)
                  return (
                    <div key={donor.id} className="top-donor-item">
                      <div className="donor-rank">#{index + 1}</div>
                      <div className="donor-info">
                        <div className="donor-name">
                          {donor.firstName} {donor.lastName}
                        </div>
                        <div className="donor-stats">
                          {formatCurrency(donor.totalDonated)} • {donor.donationCount} gifts
                          <span className="risk-indicator" style={{color: risk.color}}>
                            Risk: {risk.level}
                          </span>
                        </div>
                      </div>
                      <div className="donor-actions">
                        <Link href={`/donors/${donor.id}`} className="action-button">
                          View
                        </Link>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="empty-state">
                  <p>No donors yet</p>
                  <Link href="/donors/new" className="cta-button secondary">
                    Add First Donor
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Campaign Performance */}
        <section className="campaign-performance">
          <h2>Campaign Performance</h2>
          <div className="campaigns-grid">
            {dashboardData?.campaignPerformance?.length > 0 ? (
              dashboardData.campaignPerformance.map((campaign) => {
                const progressPercentage = campaign.goalAmount > 0 
                  ? Math.min((campaign.raised / campaign.goalAmount) * 100, 100)
                  : 0

                return (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-header">
                      <h3>{campaign.name}</h3>
                      <span className={`status-badge ${campaign.status.toLowerCase()}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="campaign-progress">
                      <div className="progress-info">
                        <span>{formatCurrency(campaign.raised)}</span>
                        <span>of {formatCurrency(campaign.goalAmount)}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${progressPercentage}%`}}
                        ></div>
                      </div>
                      <div className="progress-stats">
                        <span>{Math.round(progressPercentage)}% of goal</span>
                        <span>{campaign.donorCount} donors</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="empty-state full-width">
                <p>No campaigns created yet</p>
                <Link href="/campaigns/new" className="cta-button primary">
                  Create First Campaign
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* AI Insights Section */}
        <section className="ai-insights">
          <h2>🤖 AI-Powered Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>📈 Donor Engagement Trend</h3>
              <p>Based on recent activity, donor engagement is {dashboardData?.recentDonations?.length > 5 ? 'strong' : 'moderate'}. Consider implementing targeted follow-up strategies for donors who haven't given in the last 90 days.</p>
              <Link href="/ai-policy" className="insight-link">Learn about our AI →</Link>
            </div>
            
            <div className="insight-card">
              <h3>💡 Optimization Suggestion</h3>
              <p>Your average gift size suggests potential for upgrade campaigns. Focus on donors giving ${Math.round((dashboardData?.summary?.averageGift || 0) * 0.5)} - ${Math.round((dashboardData?.summary?.averageGift || 0) * 2)} for personalized asks.</p>
              <div className="insight-actions">
                <Link href="/campaigns/new" className="action-button">Create Campaign</Link>
              </div>
            </div>
            
            <div className="insight-card">
              <h3>🎯 Risk Management</h3>
              <p>AI analysis identifies {dashboardData?.topDonors?.filter(d => calculateRiskLevel(d).level === 'High').length || 0} high-risk donors who may need immediate attention to prevent lapse.</p>
              <div className="insight-actions">
                <Link href="/follow-ups/new" className="action-button">Schedule Follow-up</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link href="/donors/new" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Add New Donor</h3>
              <p>Register a new supporter</p>
            </Link>
            
            <Link href="/donations/new" className="action-card">
              <div className="action-icon">💰</div>
              <h3>Record Donation</h3>
              <p>Log a new contribution</p>
            </Link>
            
            <Link href="/campaigns/new" className="action-card">
              <div className="action-icon">📢</div>
              <h3>Start Campaign</h3>
              <p>Launch fundraising effort</p>
            </Link>
            
            <Link href="/follow-ups/new" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Schedule Follow-up</h3>
              <p>Plan donor outreach</p>
            </Link>
          </div>
        </section>
      </main>

      <style jsx>{`
        .summary-section {
          margin: 2rem 0;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .summary-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .summary-card:hover {
          transform: translateY(-2px);
        }

        .summary-card.primary { border-left: 4px solid #007bff; }
        .summary-card.success { border-left: 4px solid #28a745; }
        .summary-card.info { border-left: 4px solid #17a2b8; }
        .summary-card.warning { border-left: 4px solid #ffc107; }

        .summary-icon {
          font-size: 2.5rem;
        }

        .summary-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2d3748;
        }

        .summary-subtitle {
          font-size: 0.9rem;
          color: #666;
        }

        .summary-link {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 3rem 0;
        }

        .dashboard-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .dashboard-section h2 {
          margin-bottom: 1.5rem;
          color: #2d3748;
        }

        .recent-donation-item, .top-donor-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .donor-name {
          font-weight: 600;
          color: #2d3748;
        }

        .donation-details, .donor-stats {
          font-size: 0.9rem;
          color: #666;
        }

        .campaign-tag {
          background: #e2e8f0;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-left: 0.5rem;
        }

        .donor-rank {
          background: #007bff;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .risk-indicator {
          margin-left: 0.5rem;
          font-weight: 500;
        }

        .action-button {
          background: #007bff;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background 0.2s ease;
        }

        .action-button:hover {
          background: #0056b3;
        }

        .campaign-performance {
          margin: 3rem 0;
        }

        .campaign-performance h2 {
          color: #2d3748;
          margin-bottom: 2rem;
        }

        .campaigns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .campaign-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .campaign-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .campaign-header h3 {
          margin: 0;
          color: #2d3748;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .progress-bar {
          background: #e9ecef;
          height: 10px;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          background: #28a745;
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #666;
        }

        .ai-insights {
          margin: 3rem 0;
          background: #f8f9ff;
          padding: 2rem;
          border-radius: 12px;
          border-left: 4px solid #6f42c1;
        }

        .ai-insights h2 {
          color: #6f42c1;
          margin-bottom: 2rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .insight-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .insight-card h3 {
          color: #6f42c1;
          margin-bottom: 1rem;
        }

        .insight-link, .insight-actions {
          margin-top: 1rem;
        }

        .insight-link {
          color: #6f42c1;
          text-decoration: none;
          font-weight: 500;
        }

        .quick-actions h2 {
          color: #2d3748;
          margin-bottom: 2rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .action-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .action-card h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .action-card p {
          color: #666;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .empty-state.full-width {
          grid-column: 1 / -1;
        }

        .cta-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .cta-button.primary {
          background: #007bff;
          color: white;
        }

        .cta-button.secondary {
          background: transparent;
          color: #007bff;
          border: 2px solid #007bff;
        }

        .error-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .retry-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .campaigns-grid, .insights-grid, .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}