const TOKEN_STORAGE_KEY = 'taskflow_auth_token';

export function getAuthToken(): string | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }

  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}
