'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import BackButton from '@/components/BackButton'

export default function NewFollowUpPage() {
  const router = useRouter()
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    priority: 'Medium',
    type: 'Thank You',
    donorId: ''
  })

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      const response = await fetch('/api/donors')
      const data = await response.json()
      setDonors(data)
    } catch (error) {
      console.error('Error fetching donors:', error)
    } finally {
      setLoading(false)
    }
  }

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
        donorId: parseInt(formData.donorId)
      }

      const response = await fetch('/api/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        router.push('/follow-ups')
      } else {
        alert('Error creating follow-up')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating follow-up')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <BackButton fallback="/follow-ups" />
      <h1>Add New Follow-up</h1>

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
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
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
          <label className="form-label">Due Date *</label>
          <input
            type="date"
            name="dueDate"
            className="form-input"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-select"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Thank You">Thank You</option>
            <option value="Follow-up Call">Follow-up Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Follow-up'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => router.push('/follow-ups')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
