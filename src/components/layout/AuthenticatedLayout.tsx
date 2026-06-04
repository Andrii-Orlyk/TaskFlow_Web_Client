import { Outlet } from 'react-router-dom';
import { MainNav } from '../navigation/MainNav';

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b bg-white lg:border-b-0 lg:border-r">
        <div className="px-4 py-4">
          <p className="text-lg font-semibold text-slate-900">TaskFlow</p>
          <p className="text-xs text-slate-500">Authenticated shell</p>
        </div>
        <MainNav />
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="border-b bg-white px-4 py-3 lg:hidden">
          <p className="text-sm font-medium text-slate-700">TaskFlow workspace</p>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
