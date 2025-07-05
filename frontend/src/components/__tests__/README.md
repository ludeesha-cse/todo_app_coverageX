# Frontend Component Unit Tests

This directory contains comprehensive unit tests for all React components and services in the frontend application.

## Test Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── App.test.tsx
│   │   ├── Navbar.test.tsx
│   │   ├── ProtectedRoute.test.tsx
│   │   ├── TaskCard.test.tsx
│   │   └── TaskForm.test.tsx
│   └── [component files]
├── services/
│   ├── __tests__/
│   │   ├── api.test.ts
│   │   └── auth.test.tsx
│   └── [service files]
└── test/
    ├── setup.ts
    └── mocks.ts
```

## Test Coverage

### Components Tested

- **App.tsx**: Main application component with routing
- **Navbar.tsx**: Navigation component with authentication states
- **ProtectedRoute.tsx**: Route guard component
- **TaskCard.tsx**: Individual task display component
- **TaskForm.tsx**: Task creation form component

### Services Tested

- **api.ts**: API service with authentication and task management
- **auth.tsx**: Authentication provider and context

### Test Types

- **Unit Tests**: Individual component and service testing
- **Integration Tests**: Component interaction testing
- **Mock Testing**: External dependency mocking

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Features

### Component Testing

- Rendering tests
- User interaction testing
- Props validation
- State management testing
- Event handling

### Service Testing

- API method testing
- Authentication flow testing
- Error handling
- Local storage management
- Network request mocking

### Mock Data

- User objects
- Task objects
- Authentication responses
- API responses

## Dependencies

The tests use the following testing libraries:

- **Vitest**: Test runner and framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Additional matchers
- **jsdom**: DOM environment for testing

## Test Configuration

Tests are configured through:

- `vitest.config.ts`: Vitest configuration
- `src/test/setup.ts`: Global test setup
- `src/test/mocks.ts`: Mock data and utilities

## Coverage Goals

- Components: 100% line coverage
- Services: 100% line coverage
- Edge cases: Comprehensive error handling
- User interactions: All user flows tested
