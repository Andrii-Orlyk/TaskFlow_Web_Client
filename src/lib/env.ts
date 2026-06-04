function readEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

export function getApiBaseUrl(): string {
  const primary = readEnv('VITE_TASKFLOW_API_BASE_URL');
  const fallback = readEnv('VITE_API_BASE_URL');
  return primary ?? fallback ?? 'http://localhost:5000';
}

export function isMockApiEnabled(): boolean {
  return readEnv('VITE_USE_MOCK_API') === 'true';
}

export function joinApiPath(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
