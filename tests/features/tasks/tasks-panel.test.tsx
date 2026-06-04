import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TasksPanel } from '../../../src/features/tasks/components/TasksPanel';
import { renderWithApp } from '../../utils/renderWithApp';
import { stubTaskflowFetch } from '../../utils/taskflowFetchMock';

const sampleProjects = [{ id: 'p1', name: 'Portfolio App', description: null, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z' }];

const todoTask = {
  id: 't1',
  projectId: 'p1',
  title: 'Implement auth',
  description: 'Login flow',
  status: 'Todo',
  priority: 'High',
  dueDate: '2020-01-01T00:00:00.000Z',
  completedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z'
};

const doneTask = {
  ...todoTask,
  id: 't2',
  title: 'Ship release',
  status: 'Done',
  priority: 'Low',
  dueDate: null
};

describe('TasksPanel', () => {
  it('renders task list with status, priority, and overdue label', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify([todoTask, doneTask]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(sampleProjects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
    );

    renderWithApp(<TasksPanel />, { route: '/tasks' });

    const taskHeading = await screen.findByRole('heading', { name: 'Implement auth' });
    const taskCard = taskHeading.closest('article');
    expect(taskCard).not.toBeNull();
    expect(within(taskCard!).getByText('Todo')).toBeInTheDocument();
    expect(within(taskCard!).getByText('High')).toBeInTheDocument();
    expect(within(taskCard!).getByText(/Overdue/)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('filters tasks by status', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify([todoTask, doneTask]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(sampleProjects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
    );

    renderWithApp(<TasksPanel />, { route: '/tasks' });

    await screen.findByRole('heading', { name: 'Implement auth' });
    expect(screen.getByRole('heading', { name: 'Ship release' })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Status'), 'Done');

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Implement auth' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: 'Ship release' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('filters tasks by priority', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify([todoTask, doneTask]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(sampleProjects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
    );

    renderWithApp(<TasksPanel />, { route: '/tasks' });

    await screen.findByRole('heading', { name: 'Implement auth' });

    await user.selectOptions(screen.getByLabelText('Priority'), 'Low');

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Implement auth' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: 'Ship release' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows empty state when no tasks exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(sampleProjects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
    );

    renderWithApp(<TasksPanel />, { route: '/tasks' });

    expect(await screen.findByText('No tasks yet')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows validation error when creating without a title', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(sampleProjects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
    );

    renderWithApp(<TasksPanel />, { route: '/tasks' });

    await user.click(await screen.findByRole('button', { name: 'Create task' }));
    await user.selectOptions(screen.getByLabelText('Project'), 'p1');
    await user.click(screen.getByRole('button', { name: 'Create task' }));

    expect(await screen.findByText('Task title is required.')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('creates a task and shows it in the list', async () => {
    const user = userEvent.setup();

    stubTaskflowFetch({
      tasks: [],
      projects: sampleProjects,
      createdTask: todoTask
    });

    renderWithApp(<TasksPanel />, { route: '/tasks' });

    await user.click(await screen.findByRole('button', { name: 'Create task' }));
    await user.selectOptions(screen.getByLabelText('Project'), 'p1');
    await user.type(screen.getByLabelText('Task title'), 'Implement auth');
    await user.click(screen.getByRole('button', { name: 'Create task' }));

    expect(await screen.findByRole('heading', { name: 'Implement auth' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
