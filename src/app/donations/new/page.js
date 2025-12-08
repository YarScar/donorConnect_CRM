'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import DonationForm from '@/components/DonationForm'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function NewDonationPage() {
  const [donors, setDonors] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [donorsRes, campaignsRes, eventsRes] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/campaigns'),
        fetch('/api/events')
      ])
      
      setDonors(await donorsRes.json())
      setCampaigns(await campaignsRes.json())
      setEvents(await eventsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container"><LoadingSpinner /></div>

  return (
    <div className="container">
      <Navigation />
      <h1>Add New Donation</h1>
      <DonationForm donors={donors} campaigns={campaigns} events={events} />
    </div>
  )
}
