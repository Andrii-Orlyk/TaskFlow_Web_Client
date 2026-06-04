import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { TaskDetailsPanel } from '../../../src/features/tasks/components/TaskDetailsPanel';
import { renderWithApp } from '../../utils/renderWithApp';
import { stubTaskflowFetch } from '../../utils/taskflowFetchMock';

const task = {
  id: 't1',
  projectId: 'p1',
  title: 'Implement auth',
  description: 'Login flow',
  status: 'Todo',
  priority: 'High',
  dueDate: null,
  completedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z'
};

const project = {
  id: 'p1',
  name: 'Portfolio App',
  description: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z'
};

describe('TaskDetailsPanel', () => {
  it('shows not found state for missing task', async () => {
    stubTaskflowFetch({});

    renderWithApp(
      <Routes>
        <Route path="/tasks/:taskId" element={<TaskDetailsPanel />} />
      </Routes>,
      { route: '/tasks/missing' }
    );

    expect(await screen.findByRole('heading', { name: 'Task not found' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('updates task status from status actions', async () => {
    const user = userEvent.setup();
    const inProgressTask = { ...task, status: 'InProgress' };

    stubTaskflowFetch({
      task,
      patchTask: inProgressTask,
      project,
      projects: [project],
      comments: []
    });

    renderWithApp(
      <Routes>
        <Route path="/tasks/:taskId" element={<TaskDetailsPanel />} />
      </Routes>,
      { route: '/tasks/t1' }
    );

    expect(await screen.findByRole('heading', { name: 'Implement auth' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(await screen.findByText('In Progress')).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('updates task details after edit', async () => {
    const user = userEvent.setup();
    const updatedTask = { ...task, title: 'Updated auth task' };

    stubTaskflowFetch({
      task,
      putTask: updatedTask,
      project,
      projects: [project],
      comments: []
    });

    renderWithApp(
      <Routes>
        <Route path="/tasks/:taskId" element={<TaskDetailsPanel />} />
      </Routes>,
      { route: '/tasks/t1' }
    );

    await user.click(await screen.findByRole('button', { name: 'Edit task' }));
    const titleInput = screen.getByLabelText('Task title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated auth task');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('heading', { name: 'Updated auth task' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('deletes task and navigates back to list', async () => {
    const user = userEvent.setup();

    stubTaskflowFetch({
      task,
      project,
      projects: [project],
      comments: []
    });

    renderWithApp(
      <Routes>
        <Route path="/tasks" element={<h1>Tasks list</h1>} />
        <Route path="/tasks/:taskId" element={<TaskDetailsPanel />} />
      </Routes>,
      { route: '/tasks/t1' }
    );

    await user.click(await screen.findByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }));

    expect(await screen.findByRole('heading', { name: 'Tasks list' })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
