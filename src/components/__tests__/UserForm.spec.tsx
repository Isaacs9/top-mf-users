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

    // Check if all form fields are rendered
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

    // Type in the input fields
    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Check if input values are updated
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

    // Fill in the form
    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Submit the form
    fireEvent.click(submitButton);

    // Check if onCreate was called with the correct data
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

    // Fill in the form
    await userEvent.type(nomeInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Submit the form
    fireEvent.click(submitButton);

    // Check if form fields are reset
    expect(nomeInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });
});
