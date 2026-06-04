import { describe, expect, it } from 'vitest';
import { ApiClientError } from '../../../src/lib/apiErrors';
import { getTaskErrorMessage } from '../../../src/features/tasks/utils/taskErrors';

describe('getTaskErrorMessage', () => {
  it('maps not found errors', () => {
    const error = new ApiClientError({
      kind: 'notFound',
      message: 'The requested resource was not found.',
      status: 404
    });

    expect(getTaskErrorMessage(error, 'Fallback')).toBe('Task not found.');
  });

  it('maps validation errors for status changes', () => {
    const error = new ApiClientError({
      kind: 'validation',
      message: 'This status change is not valid.',
      status: 400
    });

    expect(getTaskErrorMessage(error, 'Fallback')).toBe('This status change is not valid.');
  });

  it('maps conflict errors', () => {
    const error = new ApiClientError({
      kind: 'conflict',
      message: 'Task status cannot be changed right now.',
      status: 409
    });

    expect(getTaskErrorMessage(error, 'Fallback')).toBe('Task status cannot be changed right now.');
  });
});
