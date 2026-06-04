import { getTaskPriorityLabel } from '../../tasks/utils/taskPriority';
import { getTaskStatusLabel } from '../../tasks/utils/taskStatus';
import type { TaskPriority, TaskStatus } from '../../../types/api';

type BreakdownListProps = {
  title: string;
  items: Record<string, number>;
  variant: 'status' | 'priority';
};

function formatLabel(key: string, variant: BreakdownListProps['variant']): string {
  if (variant === 'status') {
    return getTaskStatusLabel(key as TaskStatus);
  }

  return getTaskPriorityLabel(key as TaskPriority);
}

export function BreakdownList({ title, items, variant }: BreakdownListProps) {
  const entries = Object.entries(items).filter(([, count]) => count > 0);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">No data yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {entries.map(([key, count]) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">{formatLabel(key, variant)}</span>
              <span className="text-slate-600">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
