import type { TaskPriority } from '../../../types/api';
import { getTaskPriorityLabel } from '../utils/taskPriority';

type TaskPriorityBadgeProps = {
  priority: TaskPriority;
};

const priorityStyles: Record<TaskPriority, string> = {
  Low: 'bg-slate-50 text-slate-700 ring-slate-200',
  Medium: 'bg-indigo-50 text-indigo-900 ring-indigo-200',
  High: 'bg-orange-50 text-orange-900 ring-orange-200',
  Critical: 'bg-red-50 text-red-900 ring-red-200'
};

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${priorityStyles[priority]}`}>
      {getTaskPriorityLabel(priority)}
    </span>
  );
}
