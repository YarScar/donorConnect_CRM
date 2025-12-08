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

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations')
      const data = await response.json()
      setDonations(data)
      setFilteredDonations(data)
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    const filtered = donations.filter(donation =>
      `${donation.donor.firstName} ${donation.donor.lastName} ${donation.amount}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDonations(filtered)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this donation?')) {
      try {
        await fetch(`/api/donations/${id}`, { method: 'DELETE' })
        fetchDonations()
      } catch (error) {
        console.error('Error deleting donation:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0)

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <Navigation />
      
      <div className="card-header">
        <div>
          <h1 className="card-title">Donations</h1>
          <p>Total: ${totalAmount.toFixed(2)}</p>
        </div>
        <Link href="/donations/new" className="btn btn-primary">Add Donation</Link>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search donations..." />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Donor</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Campaign/Event</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map(donation => (
              <tr key={donation.id}>
                <td>{formatDate(donation.donationDate)}</td>
                <td>
                  <Link href={`/donors/${donation.donor.id}`}>
                    {donation.donor.firstName} {donation.donor.lastName}
                  </Link>
                </td>
                <td>${donation.amount.toFixed(2)}</td>
                <td>{donation.paymentMethod}</td>
                <td>{donation.campaign?.name || donation.event?.name || '-'}</td>
                <td>
                  <span className={`badge badge-${donation.status === 'Completed' ? 'success' : 'warning'}`}>
                    {donation.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(donation.id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
