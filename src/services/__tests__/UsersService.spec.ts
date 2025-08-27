import { UsersService } from '../UsersService';
import { User } from '../../domain/User';

describe('UsersService', () => {
  let service: UsersService;
  let mockFetch: jest.Mock;

  const mockUsers: User[] = [
    { id: 1, nome: 'User 1', email: 'user1@example.com' },
    { id: 2, nome: 'User 2', email: 'user2@example.com' }
  ];

  beforeEach(() => {
    // Reset the fetch mock before each test
    mockFetch = global.fetch as jest.Mock;
    mockFetch.mockClear();

    service = new UsersService();
  });

  describe('list', () => {
    it('fetches users from the API', async () => {
      // Mock the fetch response
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockUsers)
      });

      // Call the method
      const result = await service.list();

      // Check if fetch was called correctly
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/users', { credentials: 'include' });

      // Check if the result is correct
      expect(result).toEqual(mockUsers);
    });

    it('throws an error when the API request fails', async () => {
      // Mock the fetch to throw an error
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      // Call the method and expect it to throw
      await expect(service.list()).rejects.toThrow('Network error');

      // Check if fetch was called
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('creates a user via the API', async () => {
      const newUser: User = { id: 3, nome: 'New User', email: 'new@example.com' };
      const createdUser = { ...newUser, id: 3 };

      // Mock the fetch response
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(createdUser)
      });

      // Call the method
      const result = await service.create(newUser);

      // Check if fetch was called correctly
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/users', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      // Check if the result is correct
      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('updates a user via the API', async () => {
      const userId = 1;
      const nome = 'Updated Name';
      const email = 'updated@example.com';
      const updatedUser = { id: userId, nome, email };

      // Mock the fetch response
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(updatedUser)
      });

      // Call the method
      const result = await service.update(userId, nome, email);

      // Check if fetch was called correctly
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
      });

      // Check if the result is correct
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('deletes a user via the API', async () => {
      const userId = 1;

      // Mock the fetch response
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({})
      });

      // Call the method
      await service.delete(userId);

      // Check if fetch was called correctly
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    });
  });
});
