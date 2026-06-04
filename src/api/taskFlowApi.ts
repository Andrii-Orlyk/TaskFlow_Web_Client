import type {
  AuthResponseDto,
  CommentDto,
  CreateCommentRequest,
  CreateProjectRequest,
  CreateTaskRequest,
  DashboardSummaryDto,
  LoginRequest,
  ProjectDto,
  RegisterRequest,
  TaskDto,
  UpdateProjectRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  UserDto
} from '../types/api';
import { apiRequest } from './httpClient';

function extractAuthToken(response: AuthResponseDto): string {
  const token = response.token ?? response.accessToken;
  if (!token) {
    throw new Error('Auth response did not include a token.');
  }
  return token;
}

export const authApi = {
  register(payload: RegisterRequest) {
    return apiRequest<AuthResponseDto, RegisterRequest>('/api/auth/register', {
      method: 'POST',
      body: payload,
      skipAuth: true
    });
  },
  login(payload: LoginRequest) {
    return apiRequest<AuthResponseDto, LoginRequest>('/api/auth/login', {
      method: 'POST',
      body: payload,
      skipAuth: true
    });
  },
  me(token?: string | null) {
    return apiRequest<UserDto>('/api/auth/me', { token });
  },
  extractAuthToken
};

export const projectsApi = {
  list() {
    return apiRequest<ProjectDto[]>('/api/projects');
  },
  get(projectId: string) {
    return apiRequest<ProjectDto>(`/api/projects/${projectId}`);
  },
  create(payload: CreateProjectRequest) {
    return apiRequest<ProjectDto, CreateProjectRequest>('/api/projects', {
      method: 'POST',
      body: payload
    });
  },
  update(projectId: string, payload: UpdateProjectRequest) {
    return apiRequest<ProjectDto, UpdateProjectRequest>(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: payload
    });
  },
  remove(projectId: string) {
    return apiRequest<void>(`/api/projects/${projectId}`, { method: 'DELETE' });
  }
};

export const tasksApi = {
  list() {
    return apiRequest<TaskDto[]>('/api/tasks');
  },
  get(taskId: string) {
    return apiRequest<TaskDto>(`/api/tasks/${taskId}`);
  },
  create(payload: CreateTaskRequest) {
    return apiRequest<TaskDto, CreateTaskRequest>('/api/tasks', {
      method: 'POST',
      body: payload
    });
  },
  update(taskId: string, payload: UpdateTaskRequest) {
    return apiRequest<TaskDto, UpdateTaskRequest>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: payload
    });
  },
  updateStatus(taskId: string, payload: UpdateTaskStatusRequest) {
    return apiRequest<TaskDto, UpdateTaskStatusRequest>(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: payload
    });
  },
  remove(taskId: string) {
    return apiRequest<void>(`/api/tasks/${taskId}`, { method: 'DELETE' });
  }
};

export const commentsApi = {
  list(taskId: string) {
    return apiRequest<CommentDto[]>(`/api/tasks/${taskId}/comments`);
  },
  create(taskId: string, payload: CreateCommentRequest) {
    return apiRequest<CommentDto, CreateCommentRequest>(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      body: payload
    });
  },
  remove(commentId: string) {
    return apiRequest<void>(`/api/comments/${commentId}`, { method: 'DELETE' });
  }
};

export const dashboardApi = {
  summary() {
    return apiRequest<DashboardSummaryDto>('/api/dashboard/summary');
  }
};

export const taskFlowApi = {
  auth: authApi,
  projects: projectsApi,
  tasks: tasksApi,
  comments: commentsApi,
  dashboard: dashboardApi
};
