"use client"

import React, { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'

function aggregateDonationsByDay(donations) {
  const map = {}
  donations.forEach(d => {
    const day = new Date(d.donationDate).toISOString().substr(0, 10) // YYYY-MM-DD
    map[day] = (map[day] || 0) + (d.amount || 0)
  })
  const days = Object.keys(map).sort()
  return days.map(day => ({ date: day, amount: Math.round(map[day] * 100) / 100 }))
}

export default function Charts({ donationTrends = [], donationTrendsMonthly = [], donationTrendsYearly = [], donorGrowth = [], campaignPerformance = [], topDonors = [] }) {
  const [active, setActive] = useState('trends')
  const [trendRange, setTrendRange] = useState('daily') // 'daily' | 'monthly' | 'seasonal' | 'yearly'

  const lineData = useMemo(() => {
    if (trendRange === 'daily') return aggregateDonationsByDay(donationTrends)
    if (trendRange === 'yearly') {
      return donationTrendsYearly.slice().sort((a, b) => a.year - b.year).map(y => ({ date: String(y.year), amount: Math.round((y.amount || 0) * 100) / 100 }))
    }
    // monthly or seasonal -> use donationTrendsMonthly (expects [{ month, amount }])
    if (Array.isArray(donationTrendsMonthly) && donationTrendsMonthly.length > 0) {
      return donationTrendsMonthly.map(m => ({ date: m.month, amount: Math.round((m.amount || 0) * 100) / 100 }))
    }
    return []
  }, [donationTrends, donationTrendsMonthly, donationTrendsYearly, trendRange])

  const campaignsBar = useMemo(() => (
    campaignPerformance.map(c => ({ name: c.name, raised: Math.round(c.raised * 100) / 100, goal: Math.round((c.goalAmount || 0) * 100) / 100 }))
  ), [campaignPerformance])

  const topDonorsBar = useMemo(() => (
    topDonors.map(d => ({ name: `${d.firstName} ${d.lastName}`, total: Math.round((d.totalDonated || 0) * 100) / 100 }))
  ), [topDonors])

  const growthData = useMemo(() => (
    donorGrowth.slice().sort((a, b) => (a.month > b.month ? 1 : -1)).map(d => ({ month: d.month, count: d.count }))
  ), [donorGrowth])

  const pieData = useMemo(() => (
    campaignsBar.map(c => ({ name: c.name, value: c.raised }))
  ), [campaignsBar])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7']

  return (
    <section className="charts-section" style={{ margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setActive('trends')} className={`tab ${active === 'trends' ? 'active' : ''}`}>Donation Trends</button>
          <button onClick={() => setActive('growth')} className={`tab ${active === 'growth' ? 'active' : ''}`}>Donor Growth</button>
          <button onClick={() => setActive('campaigns')} className={`tab ${active === 'campaigns' ? 'active' : ''}`}>Campaigns</button>
          <button onClick={() => setActive('topDonors')} className={`tab ${active === 'topDonors' ? 'active' : ''}`}>Top Donors</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {active === 'trends' && (
            <>
              <h3 style={{ marginTop: 0 }}>Donation Trends</h3>
              <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                <button onClick={() => setTrendRange('daily')} className={`tab ${trendRange === 'daily' ? 'active' : ''}`}>Daily</button>
                <button onClick={() => setTrendRange('monthly')} className={`tab ${trendRange === 'monthly' ? 'active' : ''}`}>Monthly</button>
                <button onClick={() => setTrendRange('seasonal')} className={`tab ${trendRange === 'seasonal' ? 'active' : ''}`}>Seasonal (12mo)</button>
                <button onClick={() => setTrendRange('yearly')} className={`tab ${trendRange === 'yearly' ? 'active' : ''}`}>Yearly</button>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                    <Line type="monotone" dataKey="amount" stroke="#007bff" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {active === 'growth' && (
            <>
              <h3 style={{ marginTop: 0 }}>Donor Growth (last 6 months)</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="New Donors" fill="#28a745" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {active === 'campaigns' && (
            <>
              <h3 style={{ marginTop: 0 }}>Campaign Performance (raised vs goal)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={campaignsBar} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                      <Legend />
                      <Bar dataKey="raised" name="Raised" fill="#007bff" />
                      <Bar dataKey="goal" name="Goal" fill="#a3a3a3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Share of Raised by Campaign</h4>
                  <div style={{ width: 300, height: 260 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {active === 'topDonors' && (
            <>
              <h3 style={{ marginTop: 0 }}>Top Donors</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={topDonorsBar} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                    <Bar dataKey="total" name="Total Donated" fill="#ff7a45" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

        </div>
      </div>

      <style jsx>{`
        .tab {
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .tab.active {
          background: #007bff;
          color: white;
          border-color: rgba(0,0,0,0.05);
        }

        .tab:not(.active):hover {
          background: rgba(0,0,0,0.03);
        }
      `}</style>
    </section>
  )
}
