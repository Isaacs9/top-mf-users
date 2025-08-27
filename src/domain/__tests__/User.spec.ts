import { User } from '../User';

describe('User', () => {
  it('should create a valid User object', () => {
    const user: User = {
      id: 1,
      nome: 'Test User',
      email: 'test@example.com'
    };

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.nome).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });

  it('should allow extending the User object with additional properties', () => {
    const userWithPassword = {
      id: 1,
      nome: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    } as User & { password: string };

    expect(userWithPassword).toBeDefined();
    expect(userWithPassword.id).toBe(1);
    expect(userWithPassword.nome).toBe('Test User');
    expect(userWithPassword.email).toBe('test@example.com');
    expect(userWithPassword.password).toBe('password123');
  });
});
