'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateTotal = (donations) => {
    return donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <div className="card-header">
        <h1 className="card-title">Events</h1>
        <Link href="/events/new" className="btn btn-primary">Add Event</Link>
      </div>

      <div className="dashboard-grid">
        {events.map(event => (
          <div key={event.id} className="card">
            <div className="card-header">
              <h2 className="card-title">{event.name}</h2>
              <span className={`badge badge-${event.status === 'Upcoming' ? 'warning' : event.status === 'Completed' ? 'success' : 'secondary'}`}>
                {event.status}
              </span>
            </div>
            <div className="card-content">
              <p>{event.description}</p>
              <p><strong>Date:</strong> {formatDate(event.eventDate)}</p>
              <p><strong>Location:</strong> {event.location || 'N/A'}</p>
              <p><strong>Capacity:</strong> {event.capacity || 'N/A'}</p>
              <p><strong>Attendees:</strong> {event.attendees || 0}</p>
              <p><strong>Donations:</strong> ${calculateTotal(event.donations)} ({event.donations.length})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
