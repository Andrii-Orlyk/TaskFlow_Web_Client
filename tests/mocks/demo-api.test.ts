import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { authApi, commentsApi, dashboardApi, projectsApi, tasksApi } from '../../src/api/taskFlowApi';
import { handlers } from '../../src/mocks/handlers';
import { DEMO_PASSWORD } from '../../src/mocks/data/users';
import { resetMockStore } from '../../src/mocks/utils/store';
import { clearAuthToken, setAuthToken } from '../../src/lib/authToken';

const server = setupServer(...handlers);

async function loginDemoUser() {
  const response = await authApi.login({
    email: 'taskflow.user@demo.dev',
    password: DEMO_PASSWORD
  });
  const token = authApi.extractAuthToken(response);
  setAuthToken(token);
  return token;
}

describe('MSW demo API', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    resetMockStore();
    clearAuthToken();
  });

  afterAll(() => {
    server.close();
  });

  it('supports demo login and current user', async () => {
    await loginDemoUser();
    const me = await authApi.me();

    expect(me.email).toBe('taskflow.user@demo.dev');
  });

  it('returns demo projects for the signed-in user', async () => {
    await loginDemoUser();
    const projects = await projectsApi.list();

    expect(projects.length).toBeGreaterThanOrEqual(2);
    expect(projects.some((project) => project.name === 'Portfolio App')).toBe(true);
    expect(projects.every((project) => project.name !== 'Private workspace')).toBe(true);
  });

  it('returns demo tasks and updates status in mock state', async () => {
    await loginDemoUser();
    const tasks = await tasksApi.list();
    const target = tasks.find((task) => task.title === 'Implement authentication');

    expect(target).toBeDefined();

    const updated = await tasksApi.updateStatus(target!.id, { status: 'Done' });
    expect(updated.status).toBe('Done');

    const refreshed = await tasksApi.list();
    expect(refreshed.find((task) => task.id === target!.id)?.status).toBe('Done');
  });

  it('supports demo comments on a task', async () => {
    await loginDemoUser();
    const tasks = await tasksApi.list();
    const target = tasks.find((task) => task.title === 'Implement authentication');

    const initial = await commentsApi.list(target!.id);
    expect(initial.length).toBeGreaterThan(0);

    const created = await commentsApi.create(target!.id, { content: 'Demo comment from test' });
    const refreshed = await commentsApi.list(target!.id);

    expect(refreshed.some((comment) => comment.id === created.id)).toBe(true);
  });

  it('returns dashboard summary from mock state', async () => {
    await loginDemoUser();
    const summary = await dashboardApi.summary();

    expect(summary.totalProjects).toBeGreaterThan(0);
    expect(summary.totalTasks).toBeGreaterThan(0);
    expect(summary.tasksByStatus.InProgress).toBeGreaterThan(0);
    expect(summary.upcomingDueTasks.length).toBeGreaterThan(0);
  });

  it('rejects invalid demo credentials', async () => {
    await expect(
      authApi.login({
        email: 'taskflow.user@demo.dev',
        password: 'wrong-password'
      })
    ).rejects.toMatchObject({ kind: 'auth' });
  });

  it('rejects duplicate demo registration', async () => {
    await expect(
      authApi.register({
        email: 'taskflow.user@demo.dev',
        password: DEMO_PASSWORD,
        firstName: 'Duplicate',
        lastName: 'User'
      })
    ).rejects.toMatchObject({ kind: 'conflict', status: 409 });
  });
});
