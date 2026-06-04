import { Link } from 'react-router-dom';
import { EmptyStatePanel } from '../../../components/feedback/EmptyStatePanel';
import { ErrorStatePanel } from '../../../components/feedback/ErrorStatePanel';
import { RouteLoadingFallback } from '../../../components/feedback/RouteLoadingFallback';
import { Button } from '../../../components/ui/Button';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { getDashboardErrorMessage } from '../utils/dashboardErrors';
import { BreakdownList } from './BreakdownList';
import { StatCard } from './StatCard';
import { UpcomingTasksList } from './UpcomingTasksList';

function isDashboardEmpty(summary: {
  totalProjects: number;
  totalTasks: number;
}): boolean {
  return summary.totalProjects === 0 && summary.totalTasks === 0;
}

export function DashboardPanel() {
  const { data: summary, isLoading, isError, error, isSuccess } = useDashboardSummary();

  if (isLoading) {
    return <RouteLoadingFallback label="Loading dashboard" />;
  }

  if (isError) {
    return (
      <ErrorStatePanel
        title="Unable to load dashboard"
        message={getDashboardErrorMessage(error, 'Please try again later.')}
      >
        <Button type="button" className="bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </ErrorStatePanel>
    );
  }

  if (!summary) {
    return null;
  }

  const showEmptyState = isSuccess && isDashboardEmpty(summary);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Overview of your projects and task workload.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900 ring-1 ring-slate-300 transition hover:bg-slate-50"
          >
            View projects
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            View tasks
          </Link>
        </div>
      </div>

      {showEmptyState ? (
        <EmptyStatePanel
          title="Your workspace is empty"
          description="Create a project and add tasks to see dashboard insights here."
        >
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Go to projects
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900 ring-1 ring-slate-300 transition hover:bg-slate-50"
          >
            Go to tasks
          </Link>
        </EmptyStatePanel>
      ) : null}

      <section aria-label="Summary statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total projects" value={summary.totalProjects} />
        <StatCard label="Total tasks" value={summary.totalTasks} />
        <StatCard label="Completed tasks" value={summary.completedTasks} />
        <StatCard label="Pending tasks" value={summary.pendingTasks} hint="Todo and in progress" />
        <StatCard label="Overdue tasks" value={summary.overdueTasks} hint="Past due and not completed" />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownList title="Tasks by status" items={summary.tasksByStatus} variant="status" />
        <BreakdownList title="Tasks by priority" items={summary.tasksByPriority} variant="priority" />
      </div>

      <UpcomingTasksList tasks={summary.upcomingDueTasks} />
    </div>
  );
}
