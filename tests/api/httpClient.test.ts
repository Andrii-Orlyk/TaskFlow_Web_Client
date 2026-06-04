import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClientError } from '../../src/lib/apiErrors';
import { joinApiPath } from '../../src/lib/env';
import { apiRequest } from '../../src/api/httpClient';

describe('httpClient', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_TASKFLOW_API_BASE_URL', 'http://localhost:5000');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('joins base URL and API path without duplicate slashes', () => {
    expect(joinApiPath('http://localhost:5000/', '/api/projects')).toBe('http://localhost:5000/api/projects');
  });

  it('attaches Authorization header when token is provided', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await apiRequest('/api/auth/me', { token: 'test-token' });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-token' });
  });

  it('parses JSON success responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: '1', name: 'Alpha' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const result = await apiRequest<{ id: string; name: string }>('/api/projects/1');
    expect(result).toEqual({ id: '1', name: 'Alpha' });
  });

  it('handles empty success responses', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

    const result = await apiRequest<null>('/api/projects/1', { method: 'DELETE' });
    expect(result).toBeNull();
  });

  it.each([
    [400, 'validation', 'Please check the entered data.'],
    [401, 'auth', 'Please sign in to continue.'],
    [403, 'forbidden', 'You do not have permission to perform this action.'],
    [404, 'notFound', 'The requested resource was not found.'],
    [409, 'conflict', 'Project name already exists.'],
    [500, 'server', 'Server error. Please try again later.']
  ] as const)('maps HTTP %s to %s errors', async (status, kind, message) => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message }), {
        status,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await expect(apiRequest('/api/projects')).rejects.toMatchObject({
      name: 'ApiClientError',
      kind,
      status,
      message
    });
  });

  it('maps network failures separately from server errors', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(apiRequest('/api/projects')).rejects.toEqual(
      expect.objectContaining<Partial<ApiClientError>>({
        kind: 'network',
        message: 'Unable to reach the server. Check your connection and try again.'
      })
    );
  });
});
