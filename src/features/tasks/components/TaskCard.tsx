import { Link } from 'react-router-dom';
import type { TaskDto } from '../../../types/api';
import { TaskDueDateLabel } from './TaskDueDateLabel';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskStatusBadge } from './TaskStatusBadge';

type TaskCardProps = {
  task: TaskDto;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          <Link to={`/tasks/${task.id}`} className="hover:underline">
            {task.title}
          </Link>
        </h3>
        <div className="flex flex-wrap gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {task.description?.trim() ? task.description : 'No description provided.'}
      </p>
      <div className="mt-3">
        <TaskDueDateLabel task={task} />
      </div>
    </article>
  );
}
