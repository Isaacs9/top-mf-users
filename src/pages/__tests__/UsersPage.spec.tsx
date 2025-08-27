import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsersPage } from '../UsersPage';
import { UsersService } from '../../services/UsersService';
import { User } from '../../domain/User';

jest.mock('shell/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: { id: 1, nome: 'Test User', email: 'test@example.com' }
  })
}));

jest.mock('../../services/UsersService');

jest.mock('../../components/UserForm', () => ({
  UserForm: ({ onCreate }) => (
    <div data-testid="user-form">
      <button onClick={() => onCreate({ nome: 'New User', email: 'new@example.com', password: 'password123' })}>
        Mock Create User
      </button>
    </div>
  )
}));

jest.mock('../../components/UserList', () => ({
  UserList: ({ users, onUpdate, onDelete }) => (
    <div data-testid="user-list">
      {users.map(user => (
        <div key={user.id} data-testid={`user-${user.id}`}>
          {user.nome}
          <button onClick={() => onUpdate(user.id)}>Update</button>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}));

describe('UsersPage', () => {
  const mockUsers: User[] = [
    { id: 1, nome: 'User 1', email: 'user1@example.com' },
    { id: 2, nome: 'User 2', email: 'user2@example.com' }
  ];

  let mockService: jest.Mocked<UsersService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockService = new UsersService() as jest.Mocked<UsersService>;
    (UsersService as jest.Mock).mockImplementation(() => mockService);

    mockService.list = jest.fn().mockResolvedValue(mockUsers);
    mockService.create = jest.fn().mockResolvedValue({ id: 3, nome: 'New User', email: 'new@example.com' });
    mockService.update = jest.fn().mockResolvedValue({ id: 1, nome: 'Updated User', email: 'updated@example.com' });
    mockService.delete = jest.fn().mockResolvedValue(undefined);

    global.prompt = jest.fn().mockImplementation((message) => {
      if (message.includes('nome')) return 'Updated User';
      if (message.includes('email')) return 'updated@example.com';
      return '';
    });

    global.confirm = jest.fn().mockReturnValue(true);
  });

  it('renders the page with user information and fetches users', async () => {
    render(<UsersPage />);

    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Bem vindo Test User!')).toBeInTheDocument();

    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    expect(screen.getByTestId('user-list')).toBeInTheDocument();

    expect(mockService.list).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-2')).toBeInTheDocument();
    });
  });

  it('creates a new user when the create button is clicked', async () => {
    render(<UsersPage />);

    fireEvent.click(screen.getByText('Mock Create User'));

    expect(mockService.create).toHaveBeenCalledTimes(1);
    expect(mockService.create).toHaveBeenCalledWith({
      nome: 'New User',
      email: 'new@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expect(mockService.list).toHaveBeenCalledTimes(2);
    });
  });

  it('updates a user when the update button is clicked', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Update'));

    expect(global.prompt).toHaveBeenCalledTimes(2);

    expect(mockService.update).toHaveBeenCalledTimes(1);
    expect(mockService.update).toHaveBeenCalledWith(1, 'Updated User', 'updated@example.com');

    await waitFor(() => {
      expect(mockService.list).toHaveBeenCalledTimes(2);
    });
  });

  it('deletes a user when the delete button is clicked and confirmed', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    expect(global.confirm).toHaveBeenCalledTimes(1);

    expect(mockService.delete).toHaveBeenCalledTimes(1);
    expect(mockService.delete).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(mockService.list).toHaveBeenCalledTimes(2);
    });
  });

  it('does not delete a user when the delete is not confirmed', async () => {
    (global.confirm as jest.Mock).mockReturnValueOnce(false);

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    expect(global.confirm).toHaveBeenCalledTimes(1);

    expect(mockService.delete).not.toHaveBeenCalled();

    expect(mockService.list).toHaveBeenCalledTimes(1);
  });
});
