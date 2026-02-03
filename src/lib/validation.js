/**
 * Input validation utilities
 * Provides reusable validation functions for API routes
 */

/**
 * Validates email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number (basic US format)
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return true // Optional field
  const phoneRegex = /^[\d\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Validates zip code (US format)
 */
export function isValidZipCode(zipCode) {
  if (!zipCode || typeof zipCode !== 'string') return true // Optional field
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

/**
 * Sanitizes string input (removes potentially dangerous characters)
 */
export function sanitizeString(input) {
  if (!input || typeof input !== 'string') return input
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .slice(0, 1000) // Limit length
}

/**
 * Validates donor creation/update data
 */
export function validateDonorData(data) {
  const errors = []

  // Required fields
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('First name is required')
  }
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push('Last name is required')
  }

  // Email validation (if provided)
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format')
  }

  // Phone validation (if provided)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Invalid phone number format')
  }

  // Zip code validation (if provided)
  if (data.zipCode && !isValidZipCode(data.zipCode)) {
    errors.push('Invalid zip code format')
  }

  // Validate donor type
  const validDonorTypes = ['Individual', 'Organization', 'Foundation', 'Corporation']
  if (data.donorType && !validDonorTypes.includes(data.donorType)) {
    errors.push('Invalid donor type')
  }

  // Validate preferred contact
  const validContactMethods = ['Email', 'Phone', 'Mail']
  if (data.preferredContact && !validContactMethods.includes(data.preferredContact)) {
    errors.push('Invalid preferred contact method')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates donation data
 */
export function validateDonationData(data) {
  const errors = []

  // Required fields
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('Valid donation amount is required')
  }

  if (!data.donorId || typeof data.donorId !== 'number') {
    errors.push('Donor ID is required')
  }

  // Validate payment method
  const validPaymentMethods = ['Cash', 'Check', 'Credit Card', 'Bank Transfer', 'PayPal', 'Other']
  if (data.paymentMethod && !validPaymentMethods.includes(data.paymentMethod)) {
    errors.push('Invalid payment method')
  }

  // Validate status
  const validStatuses = ['Completed', 'Pending', 'Failed', 'Refunded']
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Invalid status')
  }

  // Validate recurring type if donation is recurring
  if (data.isRecurring) {
    const validRecurringTypes = ['Monthly', 'Quarterly', 'Yearly']
    if (!data.recurringType || !validRecurringTypes.includes(data.recurringType)) {
      errors.push('Valid recurring type is required for recurring donations')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates campaign data
 */
export function validateCampaignData(data) {
  const errors = []

  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Campaign name is required')
  }

  // Validate goal amount if provided
  if (data.goalAmount !== undefined && data.goalAmount !== null) {
    if (typeof data.goalAmount !== 'number' || data.goalAmount <= 0) {
      errors.push('Goal amount must be a positive number')
    }
  }

  // Validate dates
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    if (start >= end) {
      errors.push('End date must be after start date')
    }
  }

  // Validate status
  const validStatuses = ['Active', 'Completed', 'Planned', 'Cancelled']
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Invalid status')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates event data
 */
export function validateEventData(data) {
  const errors = []

  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Event name is required')
  }

  if (!data.eventDate) {
    errors.push('Event date is required')
  }

  // Validate capacity
  if (data.capacity !== undefined && data.capacity !== null) {
    if (typeof data.capacity !== 'number' || data.capacity <= 0) {
      errors.push('Capacity must be a positive number')
    }
  }

  // Validate ticket price
  if (data.ticketPrice !== undefined && data.ticketPrice !== null) {
    if (typeof data.ticketPrice !== 'number' || data.ticketPrice < 0) {
      errors.push('Ticket price must be a non-negative number')
    }
  }

  // Validate status
  const validStatuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled']
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Invalid status')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates follow-up data
 */
export function validateFollowUpData(data) {
  const errors = []

  // Required fields
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Follow-up title is required')
  }

  if (!data.dueDate) {
    errors.push('Due date is required')
  }

  if (!data.donorId || typeof data.donorId !== 'number') {
    errors.push('Donor ID is required')
  }

  // Validate status
  const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled']
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Invalid status')
  }

  // Validate priority
  const validPriorities = ['Low', 'Medium', 'High', 'Urgent']
  if (data.priority && !validPriorities.includes(data.priority)) {
    errors.push('Invalid priority')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Parses and validates integer ID from string
 */
export function parseId(id) {
  const parsed = parseInt(id)
  if (isNaN(parsed) || parsed <= 0) {
    return null
  }
  return parsed
}

/**
 * Validates pagination parameters
 */
export function validatePagination(page, limit) {
  const parsedPage = parseInt(page) || 1
  const parsedLimit = parseInt(limit) || 10
  
  return {
    page: Math.max(1, parsedPage),
    limit: Math.min(100, Math.max(1, parsedLimit)) // Max 100 items per page
  }
}
