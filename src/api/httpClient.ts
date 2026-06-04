import { ApiClientError, mapHttpError, mapNetworkError } from '../lib/apiErrors';
import { getApiBaseUrl, joinApiPath } from '../lib/env';
import { getAuthToken } from '../lib/authToken';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  token?: string | null;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new ApiClientError({
        kind: 'unknown',
        message: 'The server returned an invalid JSON response.'
      });
    }
  }

  return text;
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const url = joinApiPath(getApiBaseUrl(), path);
  const token = options.skipAuth ? null : (options.token ?? getAuthToken());

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: {
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined
    });
  } catch {
    throw mapNetworkError();
  }

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw mapHttpError(response.status, payload);
  }

  return payload as TResponse;
}

export { joinApiPath, getApiBaseUrl };
