import { ApiClientError } from '../../../lib/apiErrors';

export function getTaskErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    if (error.kind === 'notFound') {
      return 'Task not found.';
    }

    if (error.kind === 'forbidden') {
      return 'You do not have permission to perform this action.';
    }

    if (error.kind === 'validation') {
      return error.message || 'This status change is not valid.';
    }

    if (error.kind === 'conflict') {
      return error.message || 'Task status cannot be changed right now.';
    }

    return error.message;
  }

  return fallback;
}
