import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { Button } from '../ui/Button';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' }
] as const;

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
  ].join(' ');

export function MainNav() {
  const { user, logout } = useAuth();

  return (
    <nav aria-label="Main navigation" className="flex h-full flex-col px-2 pb-4 lg:px-3">
      <ul className="flex flex-row gap-2 lg:flex-col lg:gap-1">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to} className={linkClassName}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-3 pt-6">
        {user ? (
          <p className="px-3 text-xs text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{user.email}</span>
          </p>
        ) : null}
        <Button type="button" onClick={logout} className="w-full">
          Sign out
        </Button>
      </div>
    </nav>
  );
}
