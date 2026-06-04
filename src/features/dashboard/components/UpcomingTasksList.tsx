import { Link } from 'react-router-dom';
import type { TaskDto } from '../../../types/api';
import { TaskDueDateLabel } from '../../tasks/components/TaskDueDateLabel';
import { TaskPriorityBadge } from '../../tasks/components/TaskPriorityBadge';
import { TaskStatusBadge } from '../../tasks/components/TaskStatusBadge';

type UpcomingTasksListProps = {
  tasks: TaskDto[];
};

export function UpcomingTasksList({ tasks }: UpcomingTasksListProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Upcoming due tasks</h2>
      {tasks.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">No upcoming due tasks.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Link to={`/tasks/${task.id}`} className="font-medium text-slate-900 hover:underline">
                  {task.title}
                </Link>
                <div className="flex flex-wrap gap-2">
                  <TaskStatusBadge status={task.status} />
                  <TaskPriorityBadge priority={task.priority} />
                </div>
              </div>
              <div className="mt-2">
                <TaskDueDateLabel task={task} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
