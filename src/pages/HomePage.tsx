import { Link } from 'react-router-dom';

const features = ['Login/register/current user/logout', 'Project list/create/edit/delete', 'Task list/create/edit/delete', 'Task status transitions', 'Task comments', 'Dashboard summary', 'Filtering and UI states', 'Responsive productivity layout'];

export function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Portfolio frontend</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">TaskFlow Web Client</h1>
      <p className="mt-3 max-w-3xl text-slate-600">React + TypeScript frontend client for TaskFlow API. It demonstrates productivity UI flows: authentication, projects, tasks, comments, status transitions and dashboard summary.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/login"
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Go to sign in
        </Link>
        <Link
          to="/register"
          className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Create account
        </Link>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
            {feature}
          </div>
        ))}
      </div>
    </section>
  );
}
