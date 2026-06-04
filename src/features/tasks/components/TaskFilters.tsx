import type { TaskFilterState } from '../utils/filterTasks';
import { TASK_PRIORITY_OPTIONS, getTaskPriorityLabel } from '../utils/taskPriority';
import { TASK_STATUS_OPTIONS, getTaskStatusLabel } from '../utils/taskStatus';

export type { TaskFilterState };

type TaskFiltersProps = {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
};

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
      <div className="mt-3 flex flex-wrap gap-4">
        <div>
          <label htmlFor="task-status-filter" className="block text-xs font-medium text-slate-600">
            Status
          </label>
          <select
            id="task-status-filter"
            className="mt-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as TaskFilterState['status']
              })
            }
          >
            <option value="all">All statuses</option>
            {TASK_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {getTaskStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-priority-filter" className="block text-xs font-medium text-slate-600">
            Priority
          </label>
          <select
            id="task-priority-filter"
            className="mt-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={filters.priority}
            onChange={(event) =>
              onChange({
                ...filters,
                priority: event.target.value as TaskFilterState['priority']
              })
            }
          >
            <option value="all">All priorities</option>
            {TASK_PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {getTaskPriorityLabel(priority)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
