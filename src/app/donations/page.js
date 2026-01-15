'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SearchBar from '@/components/SearchBar'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DonationsPage() {
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(true) // For demo purposes
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations')
      const data = await response.json()
      
      // Enhance data with calculated fields
      const enhancedDonations = data.map(donation => ({
        ...donation,
        donorRiskLevel: calculateDonorRiskLevel(donation.donor)
      }))
      
      setDonations(enhancedDonations)
      applyFiltersAndSorting(enhancedDonations)
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDonorRiskLevel = (donor) => {
    if (!donor.donations || donor.donations.length === 0) return { level: 'New', color: '#6c757d' }
    
    const lastDonation = new Date(Math.max(...donor.donations.map(d => new Date(d.donationDate))))
    const daysSince = Math.floor((new Date() - lastDonation) / (1000 * 60 * 60 * 24))
    
    if (daysSince < 90) return { level: 'Low', color: '#28a745' }
    if (daysSince < 180) return { level: 'Medium', color: '#ffc107' }
    if (daysSince < 365) return { level: 'High', color: '#fd7e14' }
    return { level: 'Critical', color: '#dc3545' }
  }

  const applyFiltersAndSorting = (donationData) => {
    let filtered = [...donationData]

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(d => d.status.toLowerCase() === filterStatus)
    }

    // Apply sorting
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
        break
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.donationDate) - new Date(b.donationDate))
        break
      case 'amount-desc':
        filtered.sort((a, b) => b.amount - a.amount)
        break
      case 'amount-asc':
        filtered.sort((a, b) => a.amount - b.amount)
        break
      case 'donor-name':
        filtered.sort((a, b) => 
          `${a.donor.firstName} ${a.donor.lastName}`.localeCompare(`${b.donor.firstName} ${b.donor.lastName}`)
        )
        break
    }

    setFilteredDonations(filtered)
  }

  const handleSearch = (searchTerm) => {
    const filtered = donations.filter(donation =>
      `${donation.donor.firstName} ${donation.donor.lastName} ${donation.amount} ${donation.paymentMethod || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Apply current filters and sorting to search results
    let result = [...filtered]
    if (filterStatus !== 'all') {
      result = result.filter(d => d.status.toLowerCase() === filterStatus)
    }
    
    // Apply current sorting
    switch (sortBy) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
        break
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount)
        break
      // Add other sorting cases as needed
    }
    
    setFilteredDonations(result)
  }

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('Only administrators can delete donations.')
      return
    }
    
    if (confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      try {
        await fetch(`/api/donations/${id}`, { method: 'DELETE' })
        fetchDonations()
      } catch (error) {
        console.error('Error deleting donation:', error)
      }
    }
  }

  const handleFilterChange = (status) => {
    setFilterStatus(status)
    applyFiltersAndSorting(donations)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    applyFiltersAndSorting(donations)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Calculate statistics
  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0)
  const averageGift = filteredDonations.length > 0 ? totalAmount / filteredDonations.length : 0
  const uniqueDonors = new Set(filteredDonations.map(d => d.donorId)).size
  const recurringDonations = filteredDonations.filter(d => d.isRecurring).length

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <Navigation />
      
      <div className="donations-header">
        <div className="header-content">
          <h1>💝 Donation Management</h1>
          <p className="subtitle">Track and manage all donations to your nonprofit</p>
          {isAdmin && (
            <div className="admin-indicator">
              <span className="admin-badge">🔐 Administrator Access</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          <Link href="/donations/new" className="btn btn-primary">
            <span className="btn-icon">➕</span>
            Record Donation
          </Link>
        </div>
      </div>

      <div className="donations-stats">
        <div className="stat-card">
          <h3>{formatCurrency(totalAmount)}</h3>
          <p>Total Amount</p>
        </div>
        <div className="stat-card">
          <h3>{filteredDonations.length}</h3>
          <p>Total Donations</p>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(averageGift)}</h3>
          <p>Average Gift</p>
        </div>
        <div className="stat-card">
          <h3>{uniqueDonors}</h3>
          <p>Unique Donors</p>
        </div>
        <div className="stat-card">
          <h3>{recurringDonations}</h3>
          <p>Recurring Gifts</p>
        </div>
      </div>

      <div className="controls-section">
        <SearchBar onSearch={handleSearch} placeholder="Search donations by donor name or amount..." />
        
        <div className="filters-controls">
          <div className="filter-group">
            <label>Status Filter:</label>
            <select value={filterStatus} onChange={(e) => handleFilterChange(e.target.value)} className="filter-select">
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="filter-select">
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
              <option value="donor-name">Donor Name</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="donations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Donor Name</th>
              <th>Email</th>
              <th>Total Gifts</th>
              <th>Total Amount</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => {
              // Group by donor for the required format
              const donorGifts = donations.filter(d => d.donorId === donation.donorId)
              const donorTotalAmount = donorGifts.reduce((sum, d) => sum + d.amount, 0)
              
              // Only show one row per donor (use the first occurrence)
              const isFirstOccurrence = filteredDonations.findIndex(d => d.donorId === donation.donorId) === filteredDonations.indexOf(donation)
              if (!isFirstOccurrence) return null

              return (
                <tr key={`donor-${donation.donorId}`} className="donation-row">
                  <td>{formatDate(donation.donationDate)}</td>
                  <td>
                    <div className="donor-info">
                      <Link href={`/donors/${donation.donor.id}`} className="donor-link">
                        <strong>{donation.donor.firstName} {donation.donor.lastName}</strong>
                      </Link>
                      <div className="donor-type">{donation.donor.donorType || 'Individual'}</div>
                    </div>
                  </td>
                  <td>{donation.donor.email || '-'}</td>
                  <td>
                    <span className="gifts-count">{donorGifts.length}</span>
                  </td>
                  <td>
                    <span className="amount-value">{formatCurrency(donorTotalAmount)}</span>
                    {donorGifts.some(d => d.isRecurring) && (
                      <span className="recurring-badge">🔄 Recurring</span>
                    )}
                  </td>
                  <td>
                    <span 
                      className="risk-badge" 
                      style={{ backgroundColor: donation.donorRiskLevel.color, color: 'white' }}
                    >
                      {donation.donorRiskLevel.level}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/donors/${donation.donor.id}`} className="btn btn-view">
                        View Donor
                      </Link>
                      <Link href={`/donations/new?donorId=${donation.donor.id}`} className="btn btn-edit">
                        Add Gift
                      </Link>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(donation.id)} 
                          className="btn btn-delete"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            }).filter(Boolean)}
          </tbody>
        </table>

        {filteredDonations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💝</div>
            <h3>No Donations Found</h3>
            <p>Start tracking your nonprofit's fundraising success by recording your first donation.</p>
            <Link href="/donations/new" className="btn btn-primary">
              Record First Donation
            </Link>
          </div>
        )}
      </div>

      {/* Individual Donations Detail View */}
      <div className="donations-detail-section">
        <h2>All Individual Donations</h2>
        <div className="detail-table-container">
          <table className="detail-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Campaign/Event</th>
                <th>Status</th>
                <th>Recurring</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map(donation => (
                <tr key={donation.id} className="detail-row">
                  <td>{formatDate(donation.donationDate)}</td>
                  <td>
                    <Link href={`/donors/${donation.donor.id}`} className="donor-link">
                      {donation.donor.firstName} {donation.donor.lastName}
                    </Link>
                  </td>
                  <td className="amount-cell">{formatCurrency(donation.amount)}</td>
                  <td>{donation.paymentMethod || '-'}</td>
                  <td>
                    {donation.campaign?.name && (
                      <Link href={`/campaigns/${donation.campaign.id}`} className="campaign-link">
                        📢 {donation.campaign.name}
                      </Link>
                    )}
                    {donation.event?.name && (
                      <Link href={`/events/${donation.event.id}`} className="event-link">
                        🎪 {donation.event.name}
                      </Link>
                    )}
                    {!donation.campaign && !donation.event && '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${donation.status.toLowerCase()}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td>
                    {donation.isRecurring ? (
                      <span className="recurring-indicator">🔄 Yes</span>
                    ) : (
                      <span className="one-time-indicator">One-time</span>
                    )}
                  </td>
                  <td>
                    <div className="detail-actions">
                      <Link href={`/donations/${donation.id}/edit`} className="btn btn-edit-small">
                        Edit
                      </Link>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(donation.id)} 
                          className="btn btn-delete-small"
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
        </div>
      </div>

      <style jsx>{`
        .donations-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #28a745, #20c997);
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

        .donations-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .stat-card p {
          color: #666;
          margin: 0;
        }

        .controls-section {
          margin-bottom: 2rem;
        }

        .filters-controls {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 500;
          color: #2d3748;
        }

        .filter-select {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: white;
        }

        .table-container, .detail-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .donations-table, .detail-table {
          width: 100%;
          border-collapse: collapse;
        }

        .donations-table th, .detail-table th {
          background: #f8f9fa;
          color: #2d3748;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
        }

        .donations-table td, .detail-table td {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }

        .donation-row:hover, .detail-row:hover {
          background: #f8f9fa;
        }

        .donor-info strong {
          display: block;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .donor-type {
          color: #666;
          font-size: 0.9rem;
        }

        .donor-link {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }

        .donor-link:hover {
          text-decoration: underline;
        }

        .gifts-count {
          background: #e9ecef;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .amount-value, .amount-cell {
          font-weight: 600;
          color: #28a745;
          font-size: 1.1rem;
        }

        .recurring-badge, .recurring-indicator {
          display: block;
          font-size: 0.8rem;
          color: #6f42c1;
          margin-top: 0.25rem;
        }

        .one-time-indicator {
          color: #666;
          font-size: 0.9rem;
        }

        .risk-badge, .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-badge.completed {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .campaign-link, .event-link {
          color: #007bff;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .campaign-link:hover, .event-link:hover {
          text-decoration: underline;
        }

        .action-buttons, .detail-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
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

        .btn-edit-small {
          background: #28a745;
          color: white;
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
        }

        .btn-delete, .btn-delete-small {
          background: #dc3545;
          color: white;
        }

        .btn-delete-small {
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .btn-icon {
          margin-right: 0.5rem;
        }

        .donations-detail-section {
          margin-top: 3rem;
        }

        .donations-detail-section h2 {
          color: #2d3748;
          margin-bottom: 1rem;
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
          .donations-header {
            flex-direction: column;
            gap: 1rem;
          }

          .donations-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .donations-table, .detail-table {
            font-size: 0.9rem;
          }

          .action-buttons, .detail-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .donations-stats {
            grid-template-columns: 1fr;
          }
          
          .donations-table th,
          .donations-table td,
          .detail-table th,
          .detail-table td {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
