import type { TaskStatus } from '../../../types/api';
import { getTaskStatusLabel } from '../utils/taskStatus';

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

const statusStyles: Record<TaskStatus, string> = {
  Todo: 'bg-slate-100 text-slate-800 ring-slate-200',
  InProgress: 'bg-blue-50 text-blue-900 ring-blue-200',
  Done: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
  Cancelled: 'bg-amber-50 text-amber-900 ring-amber-200'
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[status]}`}>
      {getTaskStatusLabel(status)}
    </span>
  );
}
