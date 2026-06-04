import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '../../../src/features/auth/LoginForm';
import { renderWithApp } from '../../utils/renderWithApp';

describe('LoginForm', () => {
  it('shows validation errors for empty submit', async () => {
    const user = userEvent.setup();
    renderWithApp(<LoginForm />, { route: '/login' });

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithApp(<LoginForm />, { route: '/login' });

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
  });

  it('shows API auth error message on invalid credentials', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    renderWithApp(<LoginForm />, { route: '/login' });

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.');

    vi.unstubAllGlobals();
  });
});
