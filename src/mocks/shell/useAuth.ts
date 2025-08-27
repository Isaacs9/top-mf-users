// Mock for the useAuth hook from shell
export const useAuth = jest.fn().mockReturnValue({
  user: {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com'
  },
  login: jest.fn(),
  logout: jest.fn()
});
