import type { CommentDto, DashboardSummaryDto, ProjectDto, TaskDto, UserDto } from '../../types/api';
import { demoUsers, type MockUserRecord } from '../data/users';
import { createId, resetIdCounter } from './ids';

type MockStoreState = {
  users: MockUserRecord[];
  projects: ProjectDto[];
  tasks: TaskDto[];
  comments: CommentDto[];
  tokens: Map<string, string>;
};

const now = '2026-06-01T10:00:00.000Z';

function buildSeedStore(): MockStoreState {
  const primaryUserId = demoUsers[0].id;
  const otherUserId = demoUsers[1].id;

  const projects: ProjectDto[] = [
    {
      id: 'project-1',
      name: 'Portfolio App',
      description: 'TaskFlow web client portfolio project',
      ownerId: primaryUserId,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'project-2',
      name: 'Learning Sprint',
      description: 'Practice tasks for React and API integration',
      ownerId: primaryUserId,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'project-other-1',
      name: 'Private workspace',
      description: 'Owned by the second demo user',
      ownerId: otherUserId,
      createdAt: now,
      updatedAt: now
    }
  ];

  const tasks: TaskDto[] = [
    {
      id: 'task-1',
      projectId: 'project-1',
      title: 'Implement authentication',
      description: 'Login, register, and route guards',
      status: 'InProgress',
      priority: 'High',
      dueDate: '2026-06-10T00:00:00.000Z',
      completedAt: null,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'task-2',
      projectId: 'project-1',
      title: 'Build projects UI',
      description: 'CRUD and empty states',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '2020-01-01T00:00:00.000Z',
      completedAt: null,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'task-3',
      projectId: 'project-2',
      title: 'Write dashboard tests',
      description: 'Cover summary cards and breakdowns',
      status: 'Done',
      priority: 'Low',
      dueDate: null,
      completedAt: now,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'task-other-1',
      projectId: 'project-other-1',
      title: 'Other user task',
      description: 'Should not appear for primary demo user',
      status: 'Todo',
      priority: 'High',
      dueDate: null,
      completedAt: null,
      createdAt: now,
      updatedAt: now
    }
  ];

  const comments: CommentDto[] = [
    {
      id: 'comment-1',
      taskId: 'task-1',
      authorId: primaryUserId,
      content: 'Auth flow looks good in demo mode.',
      createdAt: now,
      updatedAt: now
    }
  ];

  return {
    users: demoUsers.map((user) => ({ ...user })),
    projects,
    tasks,
    comments,
    tokens: new Map<string, string>()
  };
}

let store = buildSeedStore();

export function resetMockStore(): void {
  resetIdCounter();
  store = buildSeedStore();
}

export function getMockStore(): MockStoreState {
  return store;
}

export function toUserDto(user: MockUserRecord): UserDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
}

export function createSessionToken(userId: string): string {
  const token = `demo-token-${userId}-${createId('session')}`;
  store.tokens.set(token, userId);
  return token;
}

export function getUserIdFromToken(token: string | null | undefined): string | null {
  if (!token) {
    return null;
  }

  return store.tokens.get(token) ?? null;
}

export function getUserProjects(userId: string): ProjectDto[] {
  return store.projects.filter((project) => project.ownerId === userId);
}

export function getUserTasks(userId: string): TaskDto[] {
  const projectIds = new Set(getUserProjects(userId).map((project) => project.id));
  return store.tasks.filter((task) => projectIds.has(task.projectId));
}

function isOverdue(task: TaskDto): boolean {
  if (!task.dueDate || task.status === 'Done' || task.status === 'Cancelled') {
    return false;
  }

  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function buildDashboardSummary(userId: string): DashboardSummaryDto {
  const userProjects = getUserProjects(userId);
  const userTasks = getUserTasks(userId);

  const tasksByStatus: Record<string, number> = {};
  const tasksByPriority: Record<string, number> = {};

  let completedTasks = 0;
  let pendingTasks = 0;
  let overdueTasks = 0;

  for (const task of userTasks) {
    tasksByStatus[task.status] = (tasksByStatus[task.status] ?? 0) + 1;
    tasksByPriority[task.priority] = (tasksByPriority[task.priority] ?? 0) + 1;

    if (task.status === 'Done') {
      completedTasks += 1;
    }

    if (task.status === 'Todo' || task.status === 'InProgress') {
      pendingTasks += 1;
    }

    if (isOverdue(task)) {
      overdueTasks += 1;
    }
  }

  const upcomingDueTasks = userTasks
    .filter((task) => task.dueDate && task.status !== 'Done' && task.status !== 'Cancelled')
    .sort((left, right) => new Date(left.dueDate ?? 0).getTime() - new Date(right.dueDate ?? 0).getTime())
    .slice(0, 5);

  return {
    totalProjects: userProjects.length,
    totalTasks: userTasks.length,
    completedTasks,
    pendingTasks,
    overdueTasks,
    tasksByStatus,
    tasksByPriority,
    upcomingDueTasks
  };
}

export function findProjectForUser(projectId: string, userId: string): ProjectDto | undefined {
  return store.projects.find((project) => project.id === projectId && project.ownerId === userId);
}

export function findTaskForUser(taskId: string, userId: string): TaskDto | undefined {
  const task = store.tasks.find((entry) => entry.id === taskId);
  if (!task) {
    return undefined;
  }

  return findProjectForUser(task.projectId, userId) ? task : undefined;
}

export function removeProjectCascade(projectId: string): void {
  const taskIds = store.tasks.filter((task) => task.projectId === projectId).map((task) => task.id);
  store.projects = store.projects.filter((project) => project.id !== projectId);
  store.tasks = store.tasks.filter((task) => task.projectId !== projectId);
  store.comments = store.comments.filter((comment) => !taskIds.includes(comment.taskId));
}

export function removeTaskCascade(taskId: string): void {
  store.tasks = store.tasks.filter((task) => task.id !== taskId);
  store.comments = store.comments.filter((comment) => comment.taskId !== taskId);
}
