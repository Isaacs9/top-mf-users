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
    mockFetch = global.fetch as jest.Mock;
    mockFetch.mockClear();

    service = new UsersService();
  });

  describe('list', () => {
    it('fetches users from the API', async () => {
      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockUsers)
      });

      const result = await service.list();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/users', { credentials: 'include' });

      expect(result).toEqual(mockUsers);
    });

    it('throws an error when the API request fails', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      await expect(service.list()).rejects.toThrow('Network error');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('creates a user via the API', async () => {
      const newUser: User = { id: 3, nome: 'New User', email: 'new@example.com' };
      const createdUser = { ...newUser, id: 3 };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(createdUser)
      });

      const result = await service.create(newUser);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/users', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('updates a user via the API', async () => {
      const userId = 1;
      const nome = 'Updated Name';
      const email = 'updated@example.com';
      const updatedUser = { id: userId, nome, email };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(updatedUser)
      });

      const result = await service.update(userId, nome, email);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
      });

      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('deletes a user via the API', async () => {
      const userId = 1;

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({})
      });

      await service.delete(userId);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    });
  });
});
