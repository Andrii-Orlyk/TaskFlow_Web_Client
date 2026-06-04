import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            TaskFlow Web Client
          </Link>
          <nav aria-label="Public navigation" className="flex flex-wrap gap-4 text-sm">
            <Link to="/login" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Link>
            <Link to="/register" className="font-medium text-slate-900 hover:underline">
              Create account
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
