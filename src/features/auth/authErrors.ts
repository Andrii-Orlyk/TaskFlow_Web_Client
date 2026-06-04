import { ApiClientError } from '../../lib/apiErrors';

export function getAuthErrorMessage(error: unknown, mode: 'login' | 'register'): string {
  if (error instanceof ApiClientError) {
    if (error.kind === 'network') {
      return error.message;
    }

    if (error.kind === 'server') {
      return error.message;
    }

    if (mode === 'login' && (error.kind === 'auth' || error.status === 401)) {
      return 'Invalid email or password.';
    }

    if (mode === 'register' && error.kind === 'conflict') {
      return 'Email is already registered.';
    }

    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
