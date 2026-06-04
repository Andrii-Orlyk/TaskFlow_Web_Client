import type { TaskPriority, TaskStatus } from '../../../types/api';

export type TaskFilterState = {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
};

export function filterTasks<T extends { status: TaskStatus; priority: TaskPriority }>(
  tasks: T[],
  filters: TaskFilterState
): T[] {
  return tasks.filter((task) => {
    const statusMatch = filters.status === 'all' || task.status === filters.status;
    const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
    return statusMatch && priorityMatch;
  });
}
