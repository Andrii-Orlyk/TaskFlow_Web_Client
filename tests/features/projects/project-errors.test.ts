import { describe, expect, it } from 'vitest';
import { ApiClientError } from '../../../src/lib/apiErrors';
import { getProjectErrorMessage } from '../../../src/features/projects/utils/projectErrors';

describe('getProjectErrorMessage', () => {
  it('maps not found errors', () => {
    const error = new ApiClientError({
      kind: 'notFound',
      message: 'The requested resource was not found.',
      status: 404
    });

    expect(getProjectErrorMessage(error, 'Fallback')).toBe('Project not found.');
  });

  it('maps forbidden errors', () => {
    const error = new ApiClientError({
      kind: 'forbidden',
      message: 'You do not have permission to perform this action.',
      status: 403
    });

    expect(getProjectErrorMessage(error, 'Fallback')).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('preserves API message for other client errors', () => {
    const error = new ApiClientError({
      kind: 'conflict',
      message: 'A project with this name already exists.',
      status: 409
    });

    expect(getProjectErrorMessage(error, 'Fallback')).toBe('A project with this name already exists.');
  });

  it('uses fallback for unknown errors', () => {
    expect(getProjectErrorMessage(new Error('network'), 'Unable to load projects.')).toBe(
      'Unable to load projects.'
    );
  });
});
