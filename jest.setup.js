// Import jest-dom for DOM assertions
require('@testing-library/jest-dom');

// Mock global objects if needed
global.fetch = jest.fn();
global.alert = jest.fn();
global.confirm = jest.fn();
global.prompt = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
