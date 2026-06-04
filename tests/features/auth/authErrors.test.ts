import { describe, expect, it } from 'vitest';
import { ApiClientError } from '../../../src/lib/apiErrors';
import { getAuthErrorMessage } from '../../../src/features/auth/authErrors';

describe('getAuthErrorMessage', () => {
  it('maps login auth failures to invalid credentials copy', () => {
    const error = new ApiClientError({
      kind: 'auth',
      status: 401,
      message: 'Please sign in to continue.'
    });

    expect(getAuthErrorMessage(error, 'login')).toBe('Invalid email or password.');
  });

  it('maps register conflicts to duplicate email copy', () => {
    const error = new ApiClientError({
      kind: 'conflict',
      status: 409,
      message: 'Email already exists.'
    });

    expect(getAuthErrorMessage(error, 'register')).toBe('Email is already registered.');
  });

  it('preserves network errors', () => {
    const error = new ApiClientError({
      kind: 'network',
      message: 'Unable to reach the server. Check your connection and try again.'
    });

    expect(getAuthErrorMessage(error, 'login')).toBe(error.message);
  });
});
