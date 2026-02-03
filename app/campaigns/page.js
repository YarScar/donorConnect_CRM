'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(true) // demo admin flag

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('Only administrators can delete campaigns.')
      return
    }

    if (!confirm('Delete this campaign? This will remove it permanently.')) return

    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchCampaigns()
    } catch (error) {
      console.error('Error deleting campaign:', error)
    }
  }

  const handleEdit = async (campaign) => {
    if (!isAdmin) return alert('Only admins can edit campaigns.')
    const name = prompt('Campaign name', campaign.name)
    if (name === null) return
    const description = prompt('Description', campaign.description || '')
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campaign, name, description })
      })
      if (!res.ok) throw new Error('Update failed')
      await fetchCampaigns()
    } catch (error) {
      console.error('Error updating campaign:', error)
    }
  }

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A'
  }

  const calculateTotal = (donations) => {
    return donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <div className="card-header">
        <h1 className="card-title">Campaigns</h1>
        <Link href="/campaigns/new" className="btn btn-primary">Add Campaign</Link>
      </div>

      <div className="dashboard-grid">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="card">
            <div className="card-header">
              <h2 className="card-title">{campaign.name}</h2>
              <span className={`badge badge-${campaign.status === 'Active' ? 'success' : 'secondary'}`}>
                {campaign.status}
              </span>
            </div>
            <div className="card-content">
              <p>{campaign.description}</p>
              <p><strong>Goal:</strong> ${campaign.goalAmount?.toFixed(2) || 'N/A'}</p>
              <p><strong>Raised:</strong> ${calculateTotal(campaign.donations)}</p>
              <p><strong>Start:</strong> {formatDate(campaign.startDate)}</p>
              <p><strong>End:</strong> {formatDate(campaign.endDate)}</p>
              <p><strong>Donations:</strong> {campaign.donations.length}</p>
              {isAdmin && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-edit" onClick={() => handleEdit(campaign)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(campaign.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
