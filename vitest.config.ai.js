import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/ai/setup.js'],
    include: ['tests/ai/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    globals: true,
    testTimeout: 60000, // AI tests might take longer
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})