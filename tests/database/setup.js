// Database test setup
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL

// Increase timeout for database operations
process.env.VITEST_POOL_TIMEOUT = '30000'