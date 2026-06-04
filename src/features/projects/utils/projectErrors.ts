import { ApiClientError } from '../../../lib/apiErrors';

export function getProjectErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    if (error.kind === 'notFound') {
      return 'Project not found.';
    }

    if (error.kind === 'forbidden') {
      return 'You do not have permission to perform this action.';
    }

    return error.message;
  }

  return fallback;
}
