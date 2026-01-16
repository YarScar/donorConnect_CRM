'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFollowUps()
  }, [])

  const fetchFollowUps = async () => {
    try {
      const response = await fetch('/api/follow-ups')
      const data = await response.json()
      setFollowUps(data)
    } catch (error) {
      console.error('Error fetching follow-ups:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this follow-up?')) {
      try {
        await fetch(`/api/follow-ups/${id}`, { method: 'DELETE' })
        fetchFollowUps()
      } catch (error) {
        console.error('Error deleting follow-up:', error)
      }
    }
  }

  const handleComplete = async (id) => {
    try {
      await fetch(`/api/follow-ups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Completed',
          completedAt: new Date().toISOString()
        })
      })
      fetchFollowUps()
    } catch (error) {
      console.error('Error completing follow-up:', error)
    }
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      
      <div className="card-header">
        <h1 className="card-title">Follow-ups</h1>
        <Link href="/follow-ups/new" className="btn btn-primary">Add Follow-up</Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Donor</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map(followUp => (
              <tr key={followUp.id}>
                <td>{followUp.title}</td>
                <td>
                  <Link href={`/donors/${followUp.donor.id}`}>
                    {followUp.donor.firstName} {followUp.donor.lastName}
                  </Link>
                </td>
                <td>{formatDate(followUp.dueDate)}</td>
                <td>
                  <span className={`badge badge-${followUp.priority === 'High' ? 'danger' : followUp.priority === 'Medium' ? 'warning' : 'success'}`}>
                    {followUp.priority}
                  </span>
                </td>
                <td>{followUp.type || '-'}</td>
                <td>
                  <span className={`badge badge-${followUp.status === 'Completed' ? 'success' : 'warning'}`}>
                    {followUp.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {followUp.status !== 'Completed' && (
                      <button 
                        onClick={() => handleComplete(followUp.id)} 
                        className="btn btn-success"
                      >
                        Complete
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(followUp.id)} 
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
