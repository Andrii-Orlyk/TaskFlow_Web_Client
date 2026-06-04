import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from '../../../src/features/auth/RegisterForm';
import { renderWithApp } from '../../utils/renderWithApp';

describe('RegisterForm', () => {
  it('shows validation errors for empty submit', async () => {
    const user = userEvent.setup();
    renderWithApp(<RegisterForm />, { route: '/register' });

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByText('Last name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
  });

  it('requires password length of at least 8 characters', async () => {
    const user = userEvent.setup();
    renderWithApp(<RegisterForm />, { route: '/register' });

    await user.type(screen.getByLabelText('First name'), 'John');
    await user.type(screen.getByLabelText('Last name'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Password must be at least 8 characters.')).toBeInTheDocument();
  });

  it('shows duplicate email message on register conflict', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Email already exists.' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    renderWithApp(<RegisterForm />, { route: '/register' });

    await user.type(screen.getByLabelText('First name'), 'Jane');
    await user.type(screen.getByLabelText('Last name'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email is already registered.');

    vi.unstubAllGlobals();
  });
});
