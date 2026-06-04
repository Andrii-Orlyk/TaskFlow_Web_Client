import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authApi } from '../../src/api/taskFlowApi';

describe('taskFlowApi.auth', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_TASKFLOW_API_BASE_URL', 'http://localhost:5000');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('extracts token from token field', () => {
    const token = authApi.extractAuthToken({
      token: 'jwt-token',
      user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B' }
    });
    expect(token).toBe('jwt-token');
  });

  it('extracts token from accessToken field', () => {
    const token = authApi.extractAuthToken({
      accessToken: 'jwt-access',
      user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B' }
    });
    expect(token).toBe('jwt-access');
  });

  it('posts login payload to /api/auth/login', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          token: 'jwt-token',
          user: { id: '1', email: 'user@example.com', firstName: 'John', lastName: 'Doe' }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const response = await authApi.login({ email: 'user@example.com', password: 'Password123!' });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', password: 'Password123!' })
      })
    );
    expect(response.user.email).toBe('user@example.com');
  });
});
