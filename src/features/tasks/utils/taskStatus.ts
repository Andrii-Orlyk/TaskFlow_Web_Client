import type { TaskStatus } from '../../../types/api';

export const TASK_STATUS_OPTIONS: TaskStatus[] = ['Todo', 'InProgress', 'Done', 'Cancelled'];

export function getTaskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'InProgress':
      return 'In Progress';
    case 'Todo':
      return 'Todo';
    case 'Done':
      return 'Done';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export type StatusTransition = {
  label: string;
  nextStatus: TaskStatus;
};

export function getAvailableStatusTransitions(status: TaskStatus): StatusTransition[] {
  switch (status) {
    case 'Todo':
      return [
        { label: 'Start', nextStatus: 'InProgress' },
        { label: 'Mark as done', nextStatus: 'Done' }
      ];
    case 'InProgress':
      return [{ label: 'Mark as done', nextStatus: 'Done' }];
    case 'Done':
      return [{ label: 'Reopen', nextStatus: 'InProgress' }];
    case 'Cancelled':
      return [];
    default:
      return [];
  }
}
