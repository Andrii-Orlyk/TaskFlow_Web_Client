import type { TaskDto } from '../../../types/api';

export function isTaskOverdue(task: Pick<TaskDto, 'dueDate' | 'status'>): boolean {
  if (!task.dueDate || task.status === 'Done' || task.status === 'Cancelled') {
    return false;
  }

  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function formatTaskDueDate(dueDate: string | null): string | null {
  if (!dueDate) {
    return null;
  }

  return new Date(dueDate).toLocaleDateString();
}
