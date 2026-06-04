import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { MainNav } from '../../../src/components/navigation/MainNav';
import { ProtectedRoute } from '../../../src/components/navigation/routeGuards';
import { setAuthToken } from '../../../src/lib/authToken';
import { renderWithApp } from '../../utils/renderWithApp';

function ProtectedScreen() {
  return (
    <section>
      <h1>Protected area</h1>
      <MainNav />
    </section>
  );
}

describe('ProtectedRoute', () => {
  it('redirects guests to login', async () => {
    renderWithApp(
      <Routes>
        <Route path="/login" element={<h1>Login screen</h1>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ProtectedScreen />} />
        </Route>
      </Routes>,
      { route: '/dashboard' }
    );

    expect(await screen.findByRole('heading', { name: 'Login screen' })).toBeInTheDocument();
  });

  it('redirects to login after logout from a protected page', async () => {
    const user = userEvent.setup();
    setAuthToken('existing-token');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: '1',
            email: 'user@example.com',
            firstName: 'User',
            lastName: 'Example'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );

    renderWithApp(
      <Routes>
        <Route path="/login" element={<h1>Login screen</h1>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ProtectedScreen />} />
        </Route>
      </Routes>,
      { route: '/dashboard' }
    );

    expect(await screen.findByRole('heading', { name: 'Protected area' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('heading', { name: 'Login screen' })).toBeInTheDocument();

    sessionStorage.clear();
    vi.unstubAllGlobals();
  });
});

describe('GuestRoute', () => {
  it('redirects authenticated users away from login', async () => {
    setAuthToken('existing-token');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: '1',
            email: 'user@example.com',
            firstName: 'User',
            lastName: 'Example'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );

    const { GuestRoute } = await import('../../../src/components/navigation/routeGuards');

    renderWithApp(
      <Routes>
        <Route path="/dashboard" element={<h1>Dashboard screen</h1>} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<h1>Login screen</h1>} />
        </Route>
      </Routes>,
      { route: '/login' }
    );

    expect(await screen.findByRole('heading', { name: 'Dashboard screen' })).toBeInTheDocument();

    sessionStorage.clear();
    vi.unstubAllGlobals();
  });
});
