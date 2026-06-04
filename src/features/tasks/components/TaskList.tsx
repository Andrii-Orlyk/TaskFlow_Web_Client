import type { TaskDto } from '../../../types/api';
import { TaskCard } from './TaskCard';

type TaskListProps = {
  tasks: TaskDto[];
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
