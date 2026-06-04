import { vi } from 'vitest';

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

type TaskflowFetchMockOptions = {
  tasks?: unknown[];
  createdTask?: unknown;
  task?: unknown;
  patchTask?: unknown;
  putTask?: unknown;
  projects?: unknown[];
  project?: unknown;
  comments?: unknown[] | unknown;
  postComment?: unknown;
  dashboardSummary?: unknown;
};

export function stubTaskflowFetch(options: TaskflowFetchMockOptions) {
  let currentTask = options.task;
  let currentTasks = Array.isArray(options.tasks) ? [...options.tasks] : [];
  let currentComments = Array.isArray(options.comments) ? [...options.comments] : [];

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';

    if (method === 'PATCH' && url.includes('/status')) {
      currentTask = options.patchTask ?? currentTask;
      return jsonResponse(currentTask);
    }

    if (method === 'PUT' && url.includes('/tasks/')) {
      currentTask = options.putTask ?? currentTask;
      return jsonResponse(currentTask);
    }

    if (method === 'DELETE' && url.includes('/comments/')) {
      const commentId = url.split('/').pop();
      currentComments = currentComments.filter((comment) => {
        const entry = comment as { id?: string };
        return entry.id !== commentId;
      });
      return new Response(null, { status: 204 });
    }

    if (method === 'DELETE') {
      return new Response(null, { status: 204 });
    }

    if (method === 'POST' && url.includes('/tasks') && !url.includes('/comments')) {
      const created = options.createdTask ?? options.task ?? { id: 'new-task' };
      currentTasks = [...currentTasks, created];
      if (!currentTask) {
        currentTask = created;
      }
      return jsonResponse(created);
    }

    if (method === 'POST' && url.includes('/comments')) {
      const created = options.postComment ?? { id: 'new-comment', content: 'New comment' };
      currentComments = [...currentComments, created];
      return jsonResponse(created);
    }

    if (url.includes('/comments')) {
      return jsonResponse(currentComments);
    }

    if (/\/tasks\/[^/]+$/.test(url) && !url.includes('comments')) {
      if (currentTask) {
        return jsonResponse(currentTask);
      }

      return jsonResponse({ message: 'Not found' }, 404);
    }

    if (url.includes('/tasks')) {
      return jsonResponse(currentTasks);
    }

    if (/\/projects\/[^/]+$/.test(url)) {
      if (options.project) {
        return jsonResponse(options.project);
      }

      return jsonResponse({ message: 'Not found' }, 404);
    }

    if (url.includes('/projects')) {
      return jsonResponse(options.projects ?? []);
    }

    if (url.includes('/dashboard')) {
      return jsonResponse(
        options.dashboardSummary ?? {
          totalProjects: 0,
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          overdueTasks: 0,
          tasksByStatus: {},
          tasksByPriority: {},
          upcomingDueTasks: []
        }
      );
    }

    return jsonResponse([]);
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
