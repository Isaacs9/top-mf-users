require('@testing-library/jest-dom');

global.fetch = jest.fn();
global.alert = jest.fn();
global.confirm = jest.fn();
global.prompt = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});
