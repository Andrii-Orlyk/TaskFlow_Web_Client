import { ApiClientError } from '../../../lib/apiErrors';

export function getCommentErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    if (error.kind === 'auth') {
      return 'Please sign in to continue.';
    }

    if (error.kind === 'notFound') {
      return 'The requested resource was not found.';
    }

    if (error.kind === 'forbidden') {
      return 'You do not have permission to perform this action.';
    }

    return error.message;
  }

  return fallback;
}
