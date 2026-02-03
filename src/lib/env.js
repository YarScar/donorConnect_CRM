/**
 * Environment variable validation
 * Validates required environment variables on application startup
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
]

const optionalEnvVars = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'LOG_LEVEL',
  'NODE_ENV'
]

export function validateEnv() {
  const missing = []
  const warnings = []

  // Check required variables
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  // Check for weak JWT secret in production
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      warnings.push('JWT_SECRET should be at least 32 characters in production')
    }
    if (process.env.JWT_SECRET.includes('dev') || process.env.JWT_SECRET.includes('test')) {
      warnings.push('JWT_SECRET appears to be a development value in production')
    }
  }

  // Check OpenAI configuration
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_MODEL) {
    warnings.push('OPENAI_API_KEY is set but OPENAI_MODEL is not configured')
  }

  // Report errors
  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      'Please set these variables in your .env file or environment.'
    )
    error.name = 'EnvironmentValidationError'
    throw error
  }

  // Report warnings
  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(
      '\n⚠️  Environment configuration warnings:\n' +
      warnings.map(w => `  - ${w}`).join('\n') +
      '\n'
    )
  }

  return true
}

// Auto-validate on import in production/development
if (process.env.NODE_ENV !== 'test') {
  validateEnv()
}
