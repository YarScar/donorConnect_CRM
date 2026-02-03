'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import DonorForm from '@/components/DonorForm'
import LoadingSpinner from '@/components/LoadingSpinner'
import BackButton from '@/components/BackButton'

export default function EditDonorPage({ params }) {
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

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <BackButton fallback="/donors" />
      <h1>Edit Donor</h1>
      {donor && <DonorForm donor={donor} />}
    </div>
  )
}
