// AI test setup
import { vi } from 'vitest'

process.env.NODE_ENV = 'test'
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-api-key-for-testing'

// Mock OpenAI API calls for consistent testing
vi.mock('openai', () => ({
  default: class OpenAI {
    constructor() {
      this.chat = {
        completions: {
          create: vi.fn()
        }
      }
    }
  }
}))

// Increase timeout for AI operations
process.env.VITEST_POOL_TIMEOUT = '60000'