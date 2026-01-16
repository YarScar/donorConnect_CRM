'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DonorDetailPage({ params }) {
  const router = useRouter()
  const [donor, setDonor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonor = async () => {
    try {
      const response = await fetch(`/api/donors/${params.id}`)
      const data = await response.json()
      setDonor(data)
    } catch (error) {
      console.error('Error fetching donor:', error)
    } finally {
      setLoading(false)
    }
    }
    fetchDonor()
  }, [params.id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>
  if (!donor) return <div className="container"><p>Donor not found</p></div>

  const totalDonations = donor.donations.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="container">
      
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{donor.firstName} {donor.lastName}</h1>
          <button 
            onClick={() => router.push(`/donors/${donor.id}/edit`)} 
            className="btn btn-primary"
          >
            Edit
          </button>
        </div>
        
        <div className="card-content">
          <h2>Contact Information</h2>
          <p><strong>Email:</strong> {donor.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {donor.phone || 'N/A'}</p>
          <p><strong>Address:</strong> {donor.address || 'N/A'}</p>
          <p><strong>City:</strong> {donor.city || 'N/A'}</p>
          <p><strong>State:</strong> {donor.state || 'N/A'}</p>
          <p><strong>Zip Code:</strong> {donor.zipCode || 'N/A'}</p>
          <p><strong>Donor Type:</strong> {donor.donorType}</p>
          {donor.notes && (
            <>
              <h3>Notes</h3>
              <p>{donor.notes}</p>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Donation History</h2>
          <p><strong>Total: ${totalDonations.toFixed(2)}</strong></p>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Campaign/Event</th>
              </tr>
            </thead>
            <tbody>
              {donor.donations.map(donation => (
                <tr key={donation.id}>
                  <td>{formatDate(donation.donationDate)}</td>
                  <td>${donation.amount.toFixed(2)}</td>
                  <td>{donation.paymentMethod}</td>
                  <td>
                    <span className={`badge badge-${donation.status === 'Completed' ? 'success' : 'warning'}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td>
                    {donation.campaign?.name || donation.event?.name || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Follow-ups</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {donor.followUps.map(followUp => (
                <tr key={followUp.id}>
                  <td>{followUp.title}</td>
                  <td>{formatDate(followUp.dueDate)}</td>
                  <td>
                    <span className={`badge badge-${followUp.status === 'Completed' ? 'success' : 'warning'}`}>
                      {followUp.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${followUp.priority === 'High' ? 'danger' : followUp.priority === 'Medium' ? 'warning' : 'success'}`}>
                      {followUp.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
