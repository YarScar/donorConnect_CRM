'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    location: '',
    capacity: '',
    attendees: '',
    status: 'Upcoming'
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
        name: formData.name,
        description: formData.description || null,
        eventDate: formData.eventDate,
        location: formData.location || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        attendees: formData.attendees ? parseInt(formData.attendees) : null,
        status: formData.status
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        router.push('/events')
      } else {
        alert('Error creating event')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <Navigation />
      <h1>Add New Event</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Name *</label>
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
          <label className="form-label">Event Date *</label>
          <input
            type="date"
            name="eventDate"
            className="form-input"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-input"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            name="capacity"
            className="form-input"
            value={formData.capacity}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Attendees</label>
          <input
            type="number"
            name="attendees"
            className="form-input"
            value={formData.attendees}
            onChange={handleChange}
            min="0"
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
            <option value="Upcoming">Upcoming</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => router.push('/events')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
