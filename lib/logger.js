/**
 * Centralized logging utility for production-ready logging
 * In production, this should integrate with a logging service like Winston, Pino, or cloud logging
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || (isProduction ? 'error' : 'debug')
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    return {
      timestamp,
      level,
      message,
      ...meta,
      environment: process.env.NODE_ENV
    }
  }

  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex <= currentLevelIndex
  }

  error(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      const formatted = this.formatMessage(LOG_LEVELS.ERROR, message, meta)
      console.error(JSON.stringify(formatted))
      
      // In production, send to error tracking service (e.g., Sentry)
      // if (isProduction) {
      //   // Sentry.captureException(new Error(message), { extra: meta })
      // }
    }
  }

  warn(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      const formatted = this.formatMessage(LOG_LEVELS.WARN, message, meta)
      console.warn(JSON.stringify(formatted))
    }
  }

  info(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      const formatted = this.formatMessage(LOG_LEVELS.INFO, message, meta)
      if (isDevelopment) {
        console.info(JSON.stringify(formatted))
      }
      // In production, send to logging service
    }
  }

  debug(message, meta = {}) {
    if (this.shouldLog(LOG_LEVELS.DEBUG) && isDevelopment) {
      const formatted = this.formatMessage(LOG_LEVELS.DEBUG, message, meta)
      console.log(JSON.stringify(formatted))
    }
  }
}

export const logger = new Logger()
