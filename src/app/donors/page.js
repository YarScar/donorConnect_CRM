'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SearchBar from '@/components/SearchBar'
import LoadingSpinner from '@/components/LoadingSpinner'
import ReactMarkdown from 'react-markdown'

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [filteredDonors, setFilteredDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(true) // For demo purposes, set to true
  const [aiInsights, setAiInsights] = useState({})
  const [loadingInsights, setLoadingInsights] = useState({})
  const [selectedInsight, setSelectedInsight] = useState(null)

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
      
      // Check for API errors
      if (!response.ok || data.error) {
        const donor = donors.find(d => d.id === donorId)
        const errorMessage = data.details || data.error || 'Failed to generate AI insights'
        
        setSelectedInsight({ 
          donorName: `${donor.firstName} ${donor.lastName}`,
          content: `⚠️ Error: ${errorMessage}\n\n${data.suggestion || 'Please try again later.'}`,
          source: 'Error',
          isError: true
        })
        return
      }
      
      const donor = donors.find(d => d.id === donorId)
      const content = data.analysis || 'No insights available'
      const source = data.source || 'AI Analysis'
      
      setAiInsights(prev => ({ ...prev, [donorId]: content }))
      setSelectedInsight({ 
        donorName: `${donor.firstName} ${donor.lastName}`,
        content: content,
        source: source,
        isError: false
      })
    } catch (error) {
      console.error('Error generating AI insight:', error)
      const donor = donors.find(d => d.id === donorId)
      setSelectedInsight({ 
        donorName: `${donor.firstName} ${donor.lastName}`,
        content: `⚠️ Network Error: Unable to connect to AI service.\n\nPlease check your internet connection and try again.`,
        source: 'Error',
        isError: true
      })
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

      {/* AI Insight Modal */}
      {selectedInsight && (
        <div className="modal-overlay" onClick={() => setSelectedInsight(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🤖 AI Insights for {selectedInsight.donorName}</h2>
              <button className="modal-close" onClick={() => setSelectedInsight(null)}>✕</button>
            </div>
            <div className="modal-source" style={{ 
              background: selectedInsight.isError ? '#fff3cd' : '#f8f9fa',
              color: selectedInsight.isError ? '#856404' : '#6c757d'
            }}>
              <small>Source: {selectedInsight.source}</small>
            </div>
            <div className="modal-body">
              <div className="insight-text">
                <ReactMarkdown>{selectedInsight.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 2px solid #e9ecef;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .modal-source {
          padding: 0.75rem 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          color: #6c757d;
          font-style: italic;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .insight-text {
          line-height: 1.8;
          color: #2d3748;
          font-size: 1rem;
        }

        /* Markdown Styling */
        .insight-text h1 {
          font-size: 1.8rem;
          color: #1a202c;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }

        .insight-text h2 {
          font-size: 1.5rem;
          color: #2d3748;
          margin-top: 1.5rem;
          margin-bottom: 0.8rem;
          font-weight: 600;
        }

        .insight-text h3 {
          font-size: 1.25rem;
          color: #4a5568;
          margin-top: 1rem;
          margin-bottom: 0.6rem;
        }

        .insight-text p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .insight-text ul, .insight-text ol {
          margin-bottom: 1rem;
          margin-left: 1.5rem;
          line-height: 1.8;
        }

        .insight-text li {
          margin-bottom: 0.5rem;
        }

        .insight-text strong {
          color: #1a202c;
          font-weight: 600;
        }

        .insight-text em {
          font-style: italic;
          color: #4a5568;
        }

        .insight-text code {
          background: #f7fafc;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #e53e3e;
        }

        .insight-text pre {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1rem;
        }

        .insight-text blockquote {
          border-left: 4px solid #667eea;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #4a5568;
          font-style: italic;
        }

        .insight-text hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 1.5rem 0;
        }

        .insight-text a {
          color: #667eea;
          text-decoration: underline;
        }

        .insight-text a:hover {
          color: #764ba2;
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
