'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DonationForm({ donation = null, donors = [], campaigns = [], events = [], onSuccess }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: donation?.amount || '',
    donationDate: donation?.donationDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    paymentMethod: donation?.paymentMethod || 'Cash',
    status: donation?.status || 'Completed',
    isRecurring: donation?.isRecurring || false,
    notes: donation?.notes || '',
    donorId: donation?.donorId || '',
    campaignId: donation?.campaignId || '',
    eventId: donation?.eventId || ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = donation ? `/api/donations/${donation.id}` : '/api/donations'
      const method = donation ? 'PUT' : 'POST'

      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        donorId: parseInt(formData.donorId),
        campaignId: formData.campaignId ? parseInt(formData.campaignId) : null,
        eventId: formData.eventId ? parseInt(formData.eventId) : null
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/donations')
        }
      } else {
        alert('Error saving donation')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving donation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Donor *</label>
        <select
          name="donorId"
          className="form-select"
          value={formData.donorId}
          onChange={handleChange}
          required
        >
          <option value="">Select Donor</option>
          {donors.map(donor => (
            <option key={donor.id} value={donor.id}>
              {donor.firstName} {donor.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Amount *</label>
        <input
          type="number"
          name="amount"
          className="form-input"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Donation Date *</label>
        <input
          type="date"
          name="donationDate"
          className="form-input"
          value={formData.donationDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Payment Method</label>
        <select
          name="paymentMethod"
          className="form-select"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="Cash">Cash</option>
          <option value="Check">Check</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Online">Online</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Campaign (Optional)</label>
        <select
          name="campaignId"
          className="form-select"
          value={formData.campaignId}
          onChange={handleChange}
        >
          <option value="">None</option>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Event (Optional)</label>
        <select
          name="eventId"
          className="form-select"
          value={formData.eventId}
          onChange={handleChange}
        >
          <option value="">None</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          Recurring Donation
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          name="notes"
          className="form-textarea"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <div className="action-buttons">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : donation ? 'Update Donation' : 'Create Donation'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => router.push('/donations')}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
