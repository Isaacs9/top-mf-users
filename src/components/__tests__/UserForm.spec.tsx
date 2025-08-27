import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '../UserForm';

describe('UserForm', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<UserForm onCreate={mockOnCreate} />);

    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Criar Usuário')).toBeInTheDocument();
  });

  it('updates input values when user types', async () => {
    render(<UserForm onCreate={mockOnCreate} />);

    const nomeInput = screen.getByPlaceholderText('Nome');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Senha');

    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(nomeInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls onCreate with form data when form is submitted', async () => {
    render(<UserForm onCreate={mockOnCreate} />);

    const nomeInput = screen.getByPlaceholderText('Nome');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Senha');
    const submitButton = screen.getByText('Criar Usuário');

    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    fireEvent.click(submitButton);

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    expect(mockOnCreate).toHaveBeenCalledWith({
      nome: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
  });

  it('resets form fields after submission', async () => {
    render(<UserForm onCreate={mockOnCreate} />);

    const nomeInput = screen.getByPlaceholderText('Nome');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Senha');
    const submitButton = screen.getByText('Criar Usuário');

    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    fireEvent.click(submitButton);

    expect(nomeInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });
});
