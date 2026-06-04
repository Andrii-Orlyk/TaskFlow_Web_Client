import type { TaskDto } from '../../../types/api';
import { formatTaskDueDate, isTaskOverdue } from '../utils/taskDates';

type TaskDueDateLabelProps = {
  task: Pick<TaskDto, 'dueDate' | 'status'>;
};

export function TaskDueDateLabel({ task }: TaskDueDateLabelProps) {
  const formattedDueDate = formatTaskDueDate(task.dueDate);

  if (!formattedDueDate) {
    return <span className="text-xs text-slate-500">No due date</span>;
  }

  const overdue = isTaskOverdue(task);

  return (
    <span className={`text-xs ${overdue ? 'font-medium text-red-800' : 'text-slate-600'}`}>
      Due {formattedDueDate}
      {overdue ? ' (Overdue)' : ''}
    </span>
  );
}
