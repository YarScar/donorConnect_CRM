# DonorCRM Testing Guide

This project uses Vitest for comprehensive testing of database connectivity, AI insights, and web application functionality.

## Test Structure

```
tests/
├── database/           # Database connectivity and data integrity tests
├── ai/                # AI insights and analysis functionality tests
├── integration/       # Web app integration tests
├── setup.js          # Global test setup
└── README.md         # This file
```

## Running Tests

### Install Test Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Database tests only
npm run test:db

# AI functionality tests only  
npm run test:ai

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Setup Test Database
```bash
npm run db:test:setup
```

## Test Categories

### 1. Database Connection Tests (`tests/database/connection.test.js`)
- **Database connectivity**: Verifies connection to PostgreSQL database
- **CRUD operations**: Tests create, read, update, delete operations
- **Data model validation**: Ensures schema constraints are enforced
- **Referential integrity**: Tests foreign key relationships
- **Transaction handling**: Verifies database transaction support
- **Query performance**: Tests query execution times
- **Data consistency**: Validates calculated fields match database values

**Key Test Cases:**
- ✅ Database connection establishment
- ✅ Donor creation with required fields
- ✅ Donation-to-donor relationship integrity
- ✅ Campaign-to-donation associations
- ✅ Follow-up tracking accuracy
- ✅ Total donation calculations
- ✅ Large dataset query performance

### 2. AI Insights Tests (`tests/ai/donor-analysis.test.js`)
- **API endpoint functionality**: Tests `/api/ai/donor-analysis` route
- **Analysis generation**: Verifies different analysis types
- **Data processing**: Tests donor summary calculations
- **Mock analysis**: Tests fallback when OpenAI unavailable
- **Error handling**: Tests malformed requests and missing data
- **Performance**: Tests response times and concurrent requests

**Key Test Cases:**
- ✅ Engagement strategy analysis generation
- ✅ Risk assessment analysis creation
- ✅ Upgrade potential evaluation
- ✅ Donor frequency calculation accuracy
- ✅ Mock analysis consistency
- ✅ API error handling
- ✅ Concurrent request processing

### 3. Web App Integration Tests (`tests/integration/web-app.test.js`)
- **Database-to-UI integration**: Tests data flow from database to frontend
- **AI insights display**: Tests AI analysis integration in UI
- **Data consistency**: Validates displayed data matches database
- **Error handling**: Tests graceful failure scenarios
- **Performance**: Tests loading times and large dataset handling
- **Data validation**: Tests input validation and format checking

**Key Test Cases:**
- ✅ Donor data display accuracy
- ✅ AI insights integration
- ✅ Real-time data updates
- ✅ Error message display
- ✅ Loading state management
- ✅ Large dataset performance

## Test Data

The tests create and clean up their own test data to ensure isolation. Each test suite:

1. **Sets up** test donors, campaigns, donations, and follow-ups
2. **Runs** the specified tests
3. **Cleans up** all test data to avoid conflicts

## Environment Variables

Ensure these environment variables are set for testing:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/your_test_db"
OPENAI_API_KEY="your-openai-api-key-or-test-key"
NODE_ENV="test"
```

## Mocking

The tests use Vitest mocking capabilities to:
- Mock OpenAI API calls for consistent AI testing
- Mock Next.js navigation components
- Mock fetch requests for integration testing
- Isolate database operations

## Expected Test Results

### Passing Tests Should Show:
- ✅ All database operations complete successfully
- ✅ AI analysis generates appropriate responses
- ✅ Web app displays correct data from database
- ✅ Error handling works as expected
- ✅ Performance meets acceptable thresholds

### Common Issues and Solutions:

1. **Database Connection Failures**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL is correct
   - Run `npm run db:test:setup` to initialize test database

2. **AI Test Failures**
   - OpenAI API key issues → Tests will use mock analysis
   - Network timeouts → Increase test timeout in vitest.config.ai.js

3. **Integration Test Failures**
   - API route import issues → Check file paths in tests
   - Mock setup problems → Verify mock implementations in setup files

## Continuous Integration

To run these tests in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run Database Tests
  run: npm run test:db
  
- name: Run AI Tests  
  run: npm run test:ai
  
- name: Run Integration Tests
  run: npm test
```

## Coverage Reports

Generate test coverage reports:
```bash
npm test -- --coverage
```

This will create a `coverage/` directory with detailed coverage reports showing which parts of your code are tested.

## Adding New Tests

When adding new features:

1. **Database changes** → Add tests to `tests/database/`
2. **AI functionality** → Add tests to `tests/ai/`
3. **UI components** → Add tests to `tests/integration/`
4. **API endpoints** → Add appropriate tests based on functionality

Follow the existing patterns for setup, execution, and cleanup to maintain test isolation and reliability.