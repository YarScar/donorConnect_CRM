'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goalAmount: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        goalAmount: formData.goalAmount ? parseFloat(formData.goalAmount) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        router.push('/campaigns')
      } else {
        alert('Error creating campaign')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <Navigation />
      <h1>Add New Campaign</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Campaign Name *</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Goal Amount</label>
          <input
            type="number"
            name="goalAmount"
            className="form-input"
            value={formData.goalAmount}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="startDate"
            className="form-input"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="endDate"
            className="form-input"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => router.push('/campaigns')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
