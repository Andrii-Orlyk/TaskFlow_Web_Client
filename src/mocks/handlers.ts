import { http } from 'msw';
import type {
  CreateCommentRequest,
  CreateProjectRequest,
  CreateTaskRequest,
  LoginRequest,
  RegisterRequest,
  TaskStatus,
  UpdateProjectRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest
} from '../types/api';
import {
  buildDashboardSummary,
  createSessionToken,
  findProjectForUser,
  findTaskForUser,
  getMockStore,
  getUserIdFromToken,
  getUserProjects,
  getUserTasks,
  removeProjectCascade,
  removeTaskCascade,
  toUserDto
} from './utils/store';
import { createId } from './utils/ids';
import { emptyResponse, errorResponse, jsonResponse } from './utils/responses';

function readBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  return header.slice('Bearer '.length);
}

function requireAuth(request: Request) {
  const userId = getUserIdFromToken(readBearerToken(request));
  if (!userId) {
    return { userId: null, error: errorResponse(401, 'Please sign in to continue.', 'unauthorized') };
  }

  return { userId, error: null };
}

const timestamp = () => new Date().toISOString();

export const handlers = [
  http.post('*/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as RegisterRequest;
    const store = getMockStore();
    const existing = store.users.find((user) => user.email.toLowerCase() === body.email.toLowerCase());

    if (existing) {
      return errorResponse(409, 'An account with this email already exists.', 'duplicate_email');
    }

    const user = {
      id: createId('user'),
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName
    };

    store.users.push(user);
    const token = createSessionToken(user.id);

    return jsonResponse({
      token,
      user: toUserDto(user)
    });
  }),

  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    const store = getMockStore();
    const user = store.users.find((entry) => entry.email.toLowerCase() === body.email.toLowerCase());

    if (!user || user.password !== body.password) {
      return errorResponse(401, 'Invalid email or password.', 'invalid_credentials');
    }

    const token = createSessionToken(user.id);

    return jsonResponse({
      token,
      user: toUserDto(user)
    });
  }),

  http.get('*/api/auth/me', ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const user = getMockStore().users.find((entry) => entry.id === auth.userId);
    if (!user) {
      return errorResponse(401, 'Please sign in to continue.', 'unauthorized');
    }

    return jsonResponse(toUserDto(user));
  }),

  http.get('*/api/projects', ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    return jsonResponse(getUserProjects(auth.userId!));
  }),

  http.get('*/api/projects/:projectId', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const project = findProjectForUser(String(params.projectId), auth.userId!);
    if (!project) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    return jsonResponse(project);
  }),

  http.post('*/api/projects', async ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const body = (await request.json()) as CreateProjectRequest;
    const createdAt = timestamp();
    const project = {
      id: createId('project'),
      name: body.name,
      description: body.description ?? null,
      ownerId: auth.userId!,
      createdAt,
      updatedAt: createdAt
    };

    getMockStore().projects.push(project);
    return jsonResponse(project, 201);
  }),

  http.put('*/api/projects/:projectId', async ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const project = findProjectForUser(String(params.projectId), auth.userId!);
    if (!project) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    const body = (await request.json()) as UpdateProjectRequest;
    project.name = body.name;
    project.description = body.description ?? null;
    project.updatedAt = timestamp();

    return jsonResponse(project);
  }),

  http.delete('*/api/projects/:projectId', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const project = findProjectForUser(String(params.projectId), auth.userId!);
    if (!project) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    removeProjectCascade(project.id);
    return emptyResponse();
  }),

  http.get('*/api/tasks', ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    return jsonResponse(getUserTasks(auth.userId!));
  }),

  http.get('*/api/tasks/:taskId', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const task = findTaskForUser(String(params.taskId), auth.userId!);
    if (!task) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    return jsonResponse(task);
  }),

  http.post('*/api/tasks', async ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const body = (await request.json()) as CreateTaskRequest;
    const project = findProjectForUser(body.projectId, auth.userId!);
    if (!project) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    const createdAt = timestamp();
    const task = {
      id: createId('task'),
      projectId: body.projectId,
      title: body.title,
      description: body.description ?? null,
      status: body.status ?? 'Todo',
      priority: body.priority ?? 'Medium',
      dueDate: body.dueDate ?? null,
      completedAt: null,
      createdAt,
      updatedAt: createdAt
    };

    getMockStore().tasks.push(task);
    return jsonResponse(task, 201);
  }),

  http.put('*/api/tasks/:taskId', async ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const task = findTaskForUser(String(params.taskId), auth.userId!);
    if (!task) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    const body = (await request.json()) as UpdateTaskRequest;
    task.title = body.title;
    task.description = body.description ?? null;
    if (body.status) {
      task.status = body.status;
    }
    if (body.priority) {
      task.priority = body.priority;
    }
    task.dueDate = body.dueDate ?? null;
    task.updatedAt = timestamp();

    if (task.status === 'Done') {
      task.completedAt = timestamp();
    }

    return jsonResponse(task);
  }),

  http.patch('*/api/tasks/:taskId/status', async ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const task = findTaskForUser(String(params.taskId), auth.userId!);
    if (!task) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    const body = (await request.json()) as UpdateTaskStatusRequest;
    const allowed: TaskStatus[] = ['Todo', 'InProgress', 'Done', 'Cancelled'];

    if (!allowed.includes(body.status)) {
      return errorResponse(400, 'This status change is not valid.', 'invalid_status');
    }

    if (task.status === 'Done' && body.status === 'Todo') {
      return errorResponse(409, 'Task status cannot be changed right now.', 'invalid_transition');
    }

    task.status = body.status;
    task.updatedAt = timestamp();
    task.completedAt = body.status === 'Done' ? timestamp() : null;

    return jsonResponse(task);
  }),

  http.delete('*/api/tasks/:taskId', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const task = findTaskForUser(String(params.taskId), auth.userId!);
    if (!task) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    removeTaskCascade(task.id);
    return emptyResponse();
  }),

  http.get('*/api/tasks/:taskId/comments', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const task = findTaskForUser(String(params.taskId), auth.userId!);
    if (!task) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    const comments = getMockStore().comments.filter((comment) => comment.taskId === task.id);
    return jsonResponse(comments);
  }),

  http.post('*/api/tasks/:taskId/comments', async ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const task = findTaskForUser(String(params.taskId), auth.userId!);
    if (!task) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    const body = (await request.json()) as CreateCommentRequest;
    if (!body.content?.trim()) {
      return errorResponse(400, 'Please check the entered data.', 'validation_error');
    }

    const createdAt = timestamp();
    const comment = {
      id: createId('comment'),
      taskId: task.id,
      authorId: auth.userId!,
      content: body.content.trim(),
      createdAt,
      updatedAt: createdAt
    };

    getMockStore().comments.push(comment);
    return jsonResponse(comment, 201);
  }),

  http.delete('*/api/comments/:commentId', ({ request, params }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    const store = getMockStore();
    const comment = store.comments.find((entry) => entry.id === String(params.commentId));
    if (!comment) {
      return errorResponse(404, 'The requested resource was not found.', 'not_found');
    }

    const task = findTaskForUser(comment.taskId, auth.userId!);
    if (!task) {
      return errorResponse(403, 'You do not have permission to perform this action.', 'forbidden');
    }

    store.comments = store.comments.filter((entry) => entry.id !== comment.id);
    return emptyResponse();
  }),

  http.get('*/api/dashboard/summary', ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) {
      return auth.error;
    }

    return jsonResponse(buildDashboardSummary(auth.userId!));
  })
];
