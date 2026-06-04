import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardPanel } from '../../../src/features/dashboard/components/DashboardPanel';
import { renderWithApp } from '../../utils/renderWithApp';
import { stubTaskflowFetch } from '../../utils/taskflowFetchMock';

const sampleSummary = {
  totalProjects: 2,
  totalTasks: 5,
  completedTasks: 2,
  pendingTasks: 3,
  overdueTasks: 1,
  tasksByStatus: {
    Todo: 2,
    InProgress: 1,
    Done: 2
  },
  tasksByPriority: {
    High: 2,
    Medium: 2,
    Low: 1
  },
  upcomingDueTasks: [
    {
      id: 't1',
      projectId: 'p1',
      title: 'Overdue review',
      description: null,
      status: 'Todo',
      priority: 'High',
      dueDate: '2020-01-01T00:00:00.000Z',
      completedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    }
  ]
};

describe('DashboardPanel', () => {
  it('renders summary cards', async () => {
    stubTaskflowFetch({ dashboardSummary: sampleSummary });

    renderWithApp(<DashboardPanel />, { route: '/dashboard' });

    expect(await screen.findByText('Total projects')).toBeInTheDocument();
    expect(within(screen.getByText('Total projects').closest('article')!).getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Total tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending tasks')).toBeInTheDocument();
    expect(screen.getByText('Overdue tasks')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows status breakdown with readable labels', async () => {
    stubTaskflowFetch({ dashboardSummary: sampleSummary });

    renderWithApp(<DashboardPanel />, { route: '/dashboard' });

    const statusSection = (await screen.findByRole('heading', { name: 'Tasks by status' })).closest('section');
    expect(statusSection).not.toBeNull();
    expect(within(statusSection!).getByText('In Progress')).toBeInTheDocument();
    expect(within(statusSection!).getByText('Todo')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows overdue count and upcoming due task', async () => {
    stubTaskflowFetch({ dashboardSummary: sampleSummary });

    renderWithApp(<DashboardPanel />, { route: '/dashboard' });

    const upcomingSection = (await screen.findByRole('heading', { name: 'Upcoming due tasks' })).closest('section');
    expect(upcomingSection).not.toBeNull();
    expect(within(upcomingSection!).getByRole('link', { name: 'Overdue review' })).toBeInTheDocument();
    expect(within(upcomingSection!).getByText(/\(Overdue\)/)).toBeInTheDocument();
    expect(within(screen.getByText('Overdue tasks').closest('article')!).getByText('1')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows empty dashboard state for new workspace', async () => {
    stubTaskflowFetch({
      dashboardSummary: {
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        tasksByStatus: {},
        tasksByPriority: {},
        upcomingDueTasks: []
      }
    });

    renderWithApp(<DashboardPanel />, { route: '/dashboard' });

    expect(await screen.findByText('Your workspace is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to projects' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows error state when summary request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    renderWithApp(<DashboardPanel />, { route: '/dashboard' });

    expect(await screen.findByRole('heading', { name: 'Unable to load dashboard' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
