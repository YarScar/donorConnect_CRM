'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DonorForm({ donor = null, onSuccess }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: donor?.firstName || '',
    lastName: donor?.lastName || '',
    email: donor?.email || '',
    phone: donor?.phone || '',
    address: donor?.address || '',
    city: donor?.city || '',
    state: donor?.state || '',
    zipCode: donor?.zipCode || '',
    donorType: donor?.donorType || 'Individual',
    notes: donor?.notes || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = donor ? `/api/donors/${donor.id}` : '/api/donors'
      const method = donor ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/donors')
        }
      } else {
        alert('Error saving donor')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving donor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">First Name *</label>
        <input
          type="text"
          name="firstName"
          className="form-input"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Last Name *</label>
        <input
          type="text"
          name="lastName"
          className="form-input"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Phone</label>
        <input
          type="tel"
          name="phone"
          className="form-input"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <input
          type="text"
          name="address"
          className="form-input"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">City</label>
        <input
          type="text"
          name="city"
          className="form-input"
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">State</label>
        <input
          type="text"
          name="state"
          className="form-input"
          value={formData.state}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Zip Code</label>
        <input
          type="text"
          name="zipCode"
          className="form-input"
          value={formData.zipCode}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Donor Type</label>
        <select
          name="donorType"
          className="form-select"
          value={formData.donorType}
          onChange={handleChange}
        >
          <option value="Individual">Individual</option>
          <option value="Organization">Organization</option>
          <option value="Foundation">Foundation</option>
        </select>
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
          {loading ? 'Saving...' : donor ? 'Update Donor' : 'Create Donor'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => router.push('/donors')}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
