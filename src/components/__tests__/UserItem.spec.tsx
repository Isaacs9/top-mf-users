import { render, screen, fireEvent } from '@testing-library/react';
import { UserItem } from '../UserItem';
import { User } from '../../domain/User';

describe('UserItem', () => {
  const mockUser: User = {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com'
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(
      <UserItem
        user={mockUser}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();

    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('calls onUpdate with user id when edit button is clicked', () => {
    render(
      <UserItem
        user={mockUser}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Editar'));

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser.id);
  });

  it('calls onDelete with user id when delete button is clicked', () => {
    render(
      <UserItem
        user={mockUser}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Excluir'));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockUser.id);
  });
});
