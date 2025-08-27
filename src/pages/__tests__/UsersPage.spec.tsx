import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsersPage } from '../UsersPage';
import { UsersService } from '../../services/UsersService';
import { User } from '../../domain/User';

// Mock the dependencies
jest.mock('shell/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: { id: 1, nome: 'Test User', email: 'test@example.com' }
  })
}));

jest.mock('../../services/UsersService');

// Mock the child components to simplify testing
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
    // Clear all mocks
    jest.clearAllMocks();

    // Setup the service mock
    mockService = new UsersService() as jest.Mocked<UsersService>;
    (UsersService as jest.Mock).mockImplementation(() => mockService);

    // Mock the service methods
    mockService.list = jest.fn().mockResolvedValue(mockUsers);
    mockService.create = jest.fn().mockResolvedValue({ id: 3, nome: 'New User', email: 'new@example.com' });
    mockService.update = jest.fn().mockResolvedValue({ id: 1, nome: 'Updated User', email: 'updated@example.com' });
    mockService.delete = jest.fn().mockResolvedValue(undefined);

    // Mock window.prompt and window.confirm
    global.prompt = jest.fn().mockImplementation((message) => {
      if (message.includes('nome')) return 'Updated User';
      if (message.includes('email')) return 'updated@example.com';
      return '';
    });

    global.confirm = jest.fn().mockReturnValue(true);
  });

  it('renders the page with user information and fetches users', async () => {
    render(<UsersPage />);

    // Check if the page title and welcome message are rendered
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Bem vindo Test User!')).toBeInTheDocument();

    // Check if the UserForm and UserList components are rendered
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    expect(screen.getByTestId('user-list')).toBeInTheDocument();

    // Check if the service.list method was called
    expect(mockService.list).toHaveBeenCalledTimes(1);

    // Wait for the users to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-2')).toBeInTheDocument();
    });
  });

  it('creates a new user when the create button is clicked', async () => {
    render(<UsersPage />);

    // Click the create button
    fireEvent.click(screen.getByText('Mock Create User'));

    // Check if the service.create method was called with the correct data
    expect(mockService.create).toHaveBeenCalledTimes(1);
    expect(mockService.create).toHaveBeenCalledWith({
      nome: 'New User',
      email: 'new@example.com',
      password: 'password123'
    });

    // Check if the service.list method was called again to refresh the list
    await waitFor(() => {
      expect(mockService.list).toHaveBeenCalledTimes(2);
    });
  });

  it('updates a user when the update button is clicked', async () => {
    render(<UsersPage />);

    // Wait for the users to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
    });

    // Click the update button for the first user
    fireEvent.click(screen.getByText('Update'));

    // Check if prompt was called for name and email
    expect(global.prompt).toHaveBeenCalledTimes(2);

    // Check if the service.update method was called with the correct data
    expect(mockService.update).toHaveBeenCalledTimes(1);
    expect(mockService.update).toHaveBeenCalledWith(1, 'Updated User', 'updated@example.com');

    // Check if the service.list method was called again to refresh the list
    await waitFor(() => {
      expect(mockService.list).toHaveBeenCalledTimes(2);
    });
  });

  it('deletes a user when the delete button is clicked and confirmed', async () => {
    render(<UsersPage />);

    // Wait for the users to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
    });

    // Click the delete button for the first user
    fireEvent.click(screen.getByText('Delete'));

    // Check if confirm was called
    expect(global.confirm).toHaveBeenCalledTimes(1);

    // Check if the service.delete method was called with the correct id
    expect(mockService.delete).toHaveBeenCalledTimes(1);
    expect(mockService.delete).toHaveBeenCalledWith(1);

    // Check if the service.list method was called again to refresh the list
    await waitFor(() => {
      expect(mockService.list).toHaveBeenCalledTimes(2);
    });
  });

  it('does not delete a user when the delete is not confirmed', async () => {
    // Override the confirm mock to return false
    (global.confirm as jest.Mock).mockReturnValueOnce(false);

    render(<UsersPage />);

    // Wait for the users to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('user-1')).toBeInTheDocument();
    });

    // Click the delete button for the first user
    fireEvent.click(screen.getByText('Delete'));

    // Check if confirm was called
    expect(global.confirm).toHaveBeenCalledTimes(1);

    // Check if the service.delete method was NOT called
    expect(mockService.delete).not.toHaveBeenCalled();

    // Check if the service.list method was NOT called again
    expect(mockService.list).toHaveBeenCalledTimes(1);
  });
});
