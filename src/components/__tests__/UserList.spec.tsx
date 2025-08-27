import { render, screen } from '@testing-library/react';
import { UserList } from '../UserList';
import { User } from '../../domain/User';

jest.mock('../UserItem', () => ({
  UserItem: ({ user, onUpdate, onDelete }) => (
    <li data-testid={`user-item-${user.id}`}>
      {user.nome} - {user.email}
      <button onClick={() => onUpdate(user.id)}>Editar</button>
      <button onClick={() => onDelete(user.id)}>Excluir</button>
    </li>
  )
}));

describe('UserList', () => {
  const mockUsers: User[] = [
    { id: 1, nome: 'User 1', email: 'user1@example.com' },
    { id: 2, nome: 'User 2', email: 'user2@example.com' },
    { id: 3, nome: 'User 3', email: 'user3@example.com' }
  ];

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a list of users', () => {
    render(
      <UserList
        users={mockUsers}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('user-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('user-item-3')).toBeInTheDocument();

    const userItems = screen.getAllByTestId(/user-item-/);
    expect(userItems).toHaveLength(3);
  });

  it('renders an empty list when no users are provided', () => {
    render(
      <UserList
        users={[]}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const userItems = screen.queryAllByTestId(/user-item-/);
    expect(userItems).toHaveLength(0);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
  });
});
