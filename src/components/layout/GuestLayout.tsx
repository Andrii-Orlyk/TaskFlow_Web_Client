import { Link, Outlet } from 'react-router-dom';

export function GuestLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            TaskFlow
          </Link>
          <nav aria-label="Guest navigation" className="flex gap-4 text-sm">
            <Link to="/login" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Link>
            <Link to="/register" className="font-medium text-slate-900 hover:underline">
              Create account
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-md flex-col px-4 py-10 sm:py-14">
        <Outlet />
      </main>
    </div>
  );
}
