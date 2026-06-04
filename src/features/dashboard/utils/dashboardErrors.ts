import { ApiClientError } from '../../../lib/apiErrors';

export function getDashboardErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    if (error.kind === 'auth') {
      return 'Please sign in to continue.';
    }

    return error.message;
  }

  return fallback;
}
