// Global test setup
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";

// Mock console.error to avoid cluttering test output
global.console = {
  ...console,
  error: jest.fn(),
};

// Setup global mocks
jest.mock("../src/utils/db", () => ({
  execute: jest.fn(),
}));
