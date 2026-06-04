import type { TaskPriority } from '../../../types/api';

export const TASK_PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export function getTaskPriorityLabel(priority: TaskPriority): string {
  return priority;
}
