"use client"

import { useRouter } from 'next/navigation'

export default function BackButton({ fallback = '/' }) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <button onClick={handleBack} className="back-button" aria-label="Go back">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </button>
  )
}
