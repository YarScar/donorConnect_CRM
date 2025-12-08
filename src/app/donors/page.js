'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SearchBar from '@/components/SearchBar'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [filteredDonors, setFilteredDonors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      const response = await fetch('/api/donors')
      const data = await response.json()
      setDonors(data)
      setFilteredDonors(data)
    } catch (error) {
      console.error('Error fetching donors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    const filtered = donors.filter(donor =>
      `${donor.firstName} ${donor.lastName} ${donor.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDonors(filtered)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this donor?')) {
      try {
        await fetch(`/api/donors/${id}`, { method: 'DELETE' })
        fetchDonors()
      } catch (error) {
        console.error('Error deleting donor:', error)
      }
    }
  }

  const calculateTotal = (donations) => {
    return donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <Navigation />
      
      <div className="card-header">
        <h1 className="card-title">Donors</h1>
        <Link href="/donors/new" className="btn btn-primary">Add Donor</Link>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search donors..." />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Total Donations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map(donor => (
              <tr key={donor.id}>
                <td>{donor.firstName} {donor.lastName}</td>
                <td>{donor.email || '-'}</td>
                <td>{donor.phone || '-'}</td>
                <td>{donor.donorType}</td>
                <td>${calculateTotal(donor.donations)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link href={`/donors/${donor.id}`} className="btn btn-secondary">
                      View
                    </Link>
                    <button 
                      onClick={() => handleDelete(donor.id)} 
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
