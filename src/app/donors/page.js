'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SearchBar from '@/components/SearchBar'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [filteredDonors, setFilteredDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(true) // For demo purposes, set to true
  const [aiInsights, setAiInsights] = useState({})
  const [loadingInsights, setLoadingInsights] = useState({})

  useEffect(() => {
    const fetchDonors = async () => {
    try {
      console.log('Fetching donors from API...')
      const response = await fetch('/api/donors')
      const data = await response.json()
      
      console.log('API Response:', data)
      console.log('Number of donors from API:', data.length)
      
      if (data.error) {
        console.error('API returned error:', data)
        return
      }
      
      // Enhance data with calculated fields using database values where available
      const enhancedDonors = data.map(donor => ({
        ...donor,
        totalGifts: donor.donations?.length || 0,
        totalAmount: donor.totalDonated || 0, // Use database field
        riskLevel: calculateRiskLevel(donor),
        lastDonationDate: donor.lastDonation ? new Date(donor.lastDonation) : null, // Use database field
        activeFollowUps: donor.followUps?.filter(fu => fu.status === 'Pending' || fu.status === 'In Progress').length || 0,
        completedFollowUps: donor.followUps?.filter(fu => fu.status === 'Completed').length || 0
      }))
      
      console.log('Enhanced donors:', enhancedDonors.map(d => `${d.firstName} ${d.lastName} - $${d.totalAmount}`))
      
      setDonors(enhancedDonors)
      setFilteredDonors(enhancedDonors)
    } catch (error) {
      console.error('Error fetching donors:', error)
    } finally {
      setLoading(false)
    }
    }
    fetchDonors()
  }, [])

  const calculateRiskLevel = (donor) => {
    if (!donor.lastDonation || donor.totalDonated === 0) return { level: 'New', color: '#6c757d' }
    
    const lastDonation = new Date(donor.lastDonation)
    const daysSince = Math.floor((new Date() - lastDonation) / (1000 * 60 * 60 * 24))
    
    if (daysSince < 90) return { level: 'Low', color: '#28a745' }
    if (daysSince < 180) return { level: 'Medium', color: '#ffc107' }
    if (daysSince < 365) return { level: 'High', color: '#fd7e14' }
    return { level: 'Critical', color: '#dc3545' }
  }

  const handleSearch = (searchTerm) => {
    const filtered = donors.filter(donor =>
      `${donor.firstName} ${donor.lastName} ${donor.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDonors(filtered)
  }

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('Only administrators can delete donors.')
      return
    }
    
    if (confirm('Are you sure you want to delete this donor? This action cannot be undone.')) {
      try {
        await fetch(`/api/donors/${id}`, { method: 'DELETE' })
        fetchDonors()
      } catch (error) {
        console.error('Error deleting donor:', error)
      }
    }
  }

  const generateAIInsight = async (donorId) => {
    setLoadingInsights(prev => ({ ...prev, [donorId]: true }))
    
    try {
      const response = await fetch('/api/ai/donor-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donorId: donorId,
          type: 'engagement_strategy'
        })
      })
      
      const data = await response.json()
      setAiInsights(prev => ({ ...prev, [donorId]: data.analysis }))
    } catch (error) {
      console.error('Error generating AI insight:', error)
      setAiInsights(prev => ({ 
        ...prev, 
        [donorId]: 'Unable to generate insights at this time. Please try again later.' 
      }))
    } finally {
      setLoadingInsights(prev => ({ ...prev, [donorId]: false }))
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : 'Never'
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <div className="donors-header">
        <div className="header-content">
          <h1>👥 Donor Management</h1>
          <p className="subtitle">Manage your nonprofit's supporter relationships</p>
          {isAdmin && (
            <div className="admin-indicator">
              <span className="admin-badge">🔐 Administrator Access</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          <Link href="/donors/new" className="btn btn-primary">
            <span className="btn-icon">➕</span>
            Add New Donor
          </Link>
        </div>
      </div>

      <div className="donors-stats">
        <div className="stat-card">
          <h3>{donors.length}</h3>
          <p>Total Donors</p>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(donors.reduce((sum, d) => sum + d.totalAmount, 0))}</h3>
          <p>Total Raised</p>
        </div>
        <div className="stat-card">
          <h3>{donors.filter(d => d.riskLevel.level === 'Critical').length}</h3>
          <p>High Risk Donors</p>
        </div>
        <div className="stat-card">
          <h3>{donors.filter(d => d.totalGifts === 0).length}</h3>
          <p>Prospects</p>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search donors by name or email..." />

      <div className="table-container">
        <table className="donors-table">
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Email</th>
              <th>Total Gifts</th>
              <th>Total Amount</th>
              <th>Risk Level</th>
              <th>Last Gift</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map(donor => (
              <tr key={donor.id} className="donor-row">
                <td>
                  <div className="donor-name">
                    <strong>{donor.firstName} {donor.lastName}</strong>
                    <div className="donor-type">{donor.donorType || 'Individual'}</div>
                  </div>
                </td>
                <td>{donor.email || '-'}</td>
                <td>
                  <span className="gift-count">{donor.totalGifts}</span>
                </td>
                <td>
                  <span className="amount-value">{formatCurrency(donor.totalAmount)}</span>
                </td>
                <td>
                  <span 
                    className="risk-badge" 
                    style={{ backgroundColor: donor.riskLevel.color, color: 'white' }}
                  >
                    {donor.riskLevel.level}
                  </span>
                </td>
                <td>{formatDate(donor.lastDonationDate)}</td>
                <td>
                  <div className="action-buttons">
                    <Link href={`/donors/${donor.id}`} className="btn btn-view">
                      View
                    </Link>
                    <Link href={`/donors/${donor.id}/edit`} className="btn btn-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => generateAIInsight(donor.id)}
                      className="btn btn-ai"
                      disabled={loadingInsights[donor.id]}
                    >
                      {loadingInsights[donor.id] ? '🤖 Analyzing...' : '🤖 AI Insight'}
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(donor.id)} 
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  {aiInsights[donor.id] && (
                    <div className="ai-insight-preview">
                      <div className="insight-content">
                        {aiInsights[donor.id].substring(0, 150)}...
                      </div>
                      <button 
                        onClick={() => setAiInsights(prev => ({ ...prev, [donor.id]: null }))}
                        className="close-insight"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDonors.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Donors Found</h3>
            <p>Start building your donor database by adding your first supporter.</p>
            <Link href="/donors/new" className="btn btn-primary">
              Add Your First Donor
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .donors-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
        }

        .header-content h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .admin-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .donors-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card h3 {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .stat-card p {
          color: #666;
          margin: 0;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .donors-table {
          width: 100%;
          border-collapse: collapse;
        }

        .donors-table th {
          background: #f8f9fa;
          color: #2d3748;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
        }

        .donors-table td {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          vertical-align: top;
        }

        .donor-row:hover {
          background: #f8f9fa;
        }

        .donor-name strong {
          display: block;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .donor-type {
          color: #666;
          font-size: 0.9rem;
        }

        .gift-count {
          background: #e9ecef;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .amount-value {
          font-weight: 600;
          color: #28a745;
          font-size: 1.1rem;
        }

        .risk-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-view {
          background: #17a2b8;
          color: white;
        }

        .btn-edit {
          background: #28a745;
          color: white;
        }

        .btn-ai {
          background: #6f42c1;
          color: white;
          font-size: 0.8rem;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .btn:disabled {
          opacity: 0.6;
          transform: none;
          cursor: not-allowed;
        }

        .btn-icon {
          margin-right: 0.5rem;
        }

        .ai-insight-preview {
          background: #f8f9ff;
          border: 1px solid #6f42c1;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          position: relative;
          max-width: 400px;
        }

        .insight-content {
          font-size: 0.9rem;
          line-height: 1.4;
          color: #4a5568;
        }

        .close-insight {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          color: #6f42c1;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .donors-header {
            flex-direction: column;
            gap: 1rem;
          }

          .donors-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .donors-table {
            font-size: 0.9rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .ai-insight-preview {
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .donors-stats {
            grid-template-columns: 1fr;
          }
          
          .donors-table th,
          .donors-table td {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
