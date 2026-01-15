#!/usr/bin/env node

/**
 * Test Runner Script for DonorCRM
 * 
 * This script provides a comprehensive way to run all tests
 * with proper setup, execution, and reporting.
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

class TestRunner {
  constructor() {
    this.testResults = {
      database: { passed: 0, failed: 0, time: 0 },
      ai: { passed: 0, failed: 0, time: 0 },
      integration: { passed: 0, failed: 0, time: 0 }
    }
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const child = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        ...options
      })

      let stdout = ''
      let stderr = ''

      child.stdout?.on('data', (data) => {
        stdout += data.toString()
        process.stdout.write(data)
      })

      child.stderr?.on('data', (data) => {
        stderr += data.toString()
        process.stderr.write(data)
      })

      child.on('close', (code) => {
        const endTime = Date.now()
        const executionTime = endTime - startTime

        if (code === 0) {
          resolve({ code, stdout, stderr, time: executionTime })
        } else {
          reject({ code, stdout, stderr, time: executionTime })
        }
      })

      child.on('error', (error) => {
        reject({ error, stdout, stderr })
      })
    })
  }

  async checkDependencies() {
    console.log('🔍 Checking dependencies...')
    
    try {
      await this.runCommand('npm', ['list', '--depth=0'])
      console.log('✅ Dependencies are installed')
      return true
    } catch (error) {
      console.log('❌ Dependencies missing. Installing...')
      await this.runCommand('npm', ['install'])
      console.log('✅ Dependencies installed')
      return true
    }
  }

  async setupTestEnvironment() {
    console.log('🛠️  Setting up test environment...')
    
    // Check if .env.test exists, create if not
    const envTestPath = path.join(process.cwd(), '.env.test')
    if (!fs.existsSync(envTestPath)) {
      const envContent = `# Test Environment Variables
NODE_ENV=test
DATABASE_URL="postgresql://test:test@localhost:5432/donorcrm_test"
OPENAI_API_KEY="test-api-key-for-testing"
`
      fs.writeFileSync(envTestPath, envContent)
      console.log('✅ Created .env.test file')
    }

    console.log('✅ Test environment ready')
  }

  async runDatabaseTests() {
    console.log('\n🗄️  Running Database Tests...')
    console.log('=' .repeat(50))
    
    try {
      const result = await this.runCommand('npx', ['vitest', 'run', '--config', 'vitest.config.db.js'])
      this.testResults.database.passed = this.parseTestResults(result.stdout)?.passed || 0
      this.testResults.database.time = result.time
      console.log('✅ Database tests completed successfully')
      return true
    } catch (error) {
      this.testResults.database.failed = this.parseTestResults(error.stdout)?.failed || 1
      this.testResults.database.time = error.time || 0
      console.log('❌ Database tests failed')
      return false
    }
  }

  async runAITests() {
    console.log('\n🤖 Running AI Tests...')
    console.log('=' .repeat(50))
    
    try {
      const result = await this.runCommand('npx', ['vitest', 'run', '--config', 'vitest.config.ai.js'])
      this.testResults.ai.passed = this.parseTestResults(result.stdout)?.passed || 0
      this.testResults.ai.time = result.time
      console.log('✅ AI tests completed successfully')
      return true
    } catch (error) {
      this.testResults.ai.failed = this.parseTestResults(error.stdout)?.failed || 1
      this.testResults.ai.time = error.time || 0
      console.log('❌ AI tests failed')
      return false
    }
  }

  async runIntegrationTests() {
    console.log('\n🔗 Running Integration Tests...')
    console.log('=' .repeat(50))
    
    try {
      const result = await this.runCommand('npx', ['vitest', 'run', 'tests/integration'])
      this.testResults.integration.passed = this.parseTestResults(result.stdout)?.passed || 0
      this.testResults.integration.time = result.time
      console.log('✅ Integration tests completed successfully')
      return true
    } catch (error) {
      this.testResults.integration.failed = this.parseTestResults(error.stdout)?.failed || 1
      this.testResults.integration.time = error.time || 0
      console.log('❌ Integration tests failed')
      return false
    }
  }

  parseTestResults(output) {
    // Simple parser for test results - in practice, you'd want more robust parsing
    const passedMatch = output.match(/(\d+) passed/)
    const failedMatch = output.match(/(\d+) failed/)
    
    return {
      passed: passedMatch ? parseInt(passedMatch[1]) : 0,
      failed: failedMatch ? parseInt(failedMatch[1]) : 0
    }
  }

  generateReport() {
    console.log('\n📊 Test Results Summary')
    console.log('=' .repeat(50))
    
    const totalPassed = Object.values(this.testResults).reduce((sum, result) => sum + result.passed, 0)
    const totalFailed = Object.values(this.testResults).reduce((sum, result) => sum + result.failed, 0)
    const totalTime = Object.values(this.testResults).reduce((sum, result) => sum + result.time, 0)

    console.log(`Database Tests:     ${this.testResults.database.passed} passed, ${this.testResults.database.failed} failed (${this.testResults.database.time}ms)`)
    console.log(`AI Tests:           ${this.testResults.ai.passed} passed, ${this.testResults.ai.failed} failed (${this.testResults.ai.time}ms)`)
    console.log(`Integration Tests:  ${this.testResults.integration.passed} passed, ${this.testResults.integration.failed} failed (${this.testResults.integration.time}ms)`)
    console.log('-' .repeat(50))
    console.log(`Total:              ${totalPassed} passed, ${totalFailed} failed (${totalTime}ms)`)
    
    if (totalFailed === 0) {
      console.log('\n🎉 All tests passed! Your DonorCRM is working correctly.')
    } else {
      console.log('\n⚠️  Some tests failed. Please check the output above for details.')
    }

    return totalFailed === 0
  }

  async runAllTests() {
    const startTime = Date.now()
    
    console.log('🚀 DonorCRM Test Suite')
    console.log('=' .repeat(50))
    
    try {
      // Setup
      await this.checkDependencies()
      await this.setupTestEnvironment()
      
      // Run test suites
      const dbSuccess = await this.runDatabaseTests()
      const aiSuccess = await this.runAITests()
      const integrationSuccess = await this.runIntegrationTests()
      
      // Generate report
      const allPassed = this.generateReport()
      
      const endTime = Date.now()
      console.log(`\nTotal execution time: ${endTime - startTime}ms`)
      
      process.exit(allPassed ? 0 : 1)
      
    } catch (error) {
      console.error('❌ Test execution failed:', error)
      process.exit(1)
    }
  }
}

// CLI handling
const args = process.argv.slice(2)
const runner = new TestRunner()

if (args.length === 0 || args.includes('--all')) {
  runner.runAllTests()
} else if (args.includes('--db')) {
  runner.checkDependencies().then(() => runner.runDatabaseTests())
} else if (args.includes('--ai')) {
  runner.checkDependencies().then(() => runner.runAITests())
} else if (args.includes('--integration')) {
  runner.checkDependencies().then(() => runner.runIntegrationTests())
} else {
  console.log(`
Usage: node run-tests.js [options]

Options:
  --all           Run all test suites (default)
  --db            Run database tests only
  --ai            Run AI tests only
  --integration   Run integration tests only

Examples:
  node run-tests.js                 # Run all tests
  node run-tests.js --db            # Run database tests only
  node run-tests.js --ai --db       # Run AI and database tests
`)
}