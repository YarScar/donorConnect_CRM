'use client'

import { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  )
}
