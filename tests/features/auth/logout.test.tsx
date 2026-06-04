import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { MainNav } from '../../../src/components/navigation/MainNav';
import { ProtectedRoute } from '../../../src/components/navigation/routeGuards';
import { useAuth } from '../../../src/features/auth/useAuth';
import { clearAuthToken, getAuthToken, setAuthToken } from '../../../src/lib/authToken';
import { renderWithApp } from '../../utils/renderWithApp';

const meResponse = {
  id: '1',
  email: 'user@example.com',
  firstName: 'User',
  lastName: 'Example'
};

function stubMeFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(meResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
  );
}

function ProtectedDashboard() {
  const { user, isAuthenticated } = useAuth();

  return (
    <section>
      <h1>Protected area</h1>
      <p>{isAuthenticated ? 'authenticated' : 'guest'}</p>
      <p>{user?.email ?? 'no-user'}</p>
      <MainNav />
    </section>
  );
}

describe('logout', () => {
  it('clears auth token when sign out is clicked', async () => {
    const user = userEvent.setup();
    setAuthToken('test-token');
    stubMeFetch();

    renderWithApp(<MainNav />);

    expect(await screen.findByText(/user@example.com/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(getAuthToken()).toBeNull();

    vi.unstubAllGlobals();
    clearAuthToken();
  });

  it('clears authenticated UI state immediately after sign out', async () => {
    const user = userEvent.setup();
    setAuthToken('test-token');
    stubMeFetch();

    renderWithApp(<MainNav />);

    expect(await screen.findByText(/user@example.com/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(screen.queryByText(/Signed in as/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/user@example.com/i)).not.toBeInTheDocument();

    vi.unstubAllGlobals();
    clearAuthToken();
  });

  it('redirects protected route to login after sign out', async () => {
    const user = userEvent.setup();
    setAuthToken('test-token');
    stubMeFetch();

    renderWithApp(
      <Routes>
        <Route path="/login" element={<h1>Login screen</h1>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ProtectedDashboard />} />
        </Route>
      </Routes>,
      { route: '/dashboard' }
    );

    expect(await screen.findByRole('heading', { name: 'Protected area' })).toBeInTheDocument();
    expect(screen.getByText('authenticated')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('heading', { name: 'Login screen' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Protected area' })).not.toBeInTheDocument();
    expect(getAuthToken()).toBeNull();

    vi.unstubAllGlobals();
    clearAuthToken();
  });

  it('stays unauthenticated after remount when token was cleared', async () => {
    const user = userEvent.setup();
    setAuthToken('test-token');
    stubMeFetch();

    const view = renderWithApp(<MainNav />);

    await user.click(await screen.findByRole('button', { name: 'Sign out' }));
    expect(getAuthToken()).toBeNull();

    view.unmount();

    renderWithApp(<MainNav />);

    expect(screen.queryByText(/Signed in as/i)).not.toBeInTheDocument();

    vi.unstubAllGlobals();
    clearAuthToken();
  });
});
