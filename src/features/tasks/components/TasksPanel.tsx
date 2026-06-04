import { useMemo, useState } from 'react';
import { RouteLoadingFallback } from '../../../components/feedback/RouteLoadingFallback';
import { Button } from '../../../components/ui/Button';
import { useProjects } from '../../projects/hooks/useProjects';
import type { TaskPriority, TaskStatus } from '../../../types/api';
import { useCreateTask } from '../hooks/useTaskMutations';
import { useTasks } from '../hooks/useTasks';
import type { TaskFormValues } from '../schemas/taskSchemas';
import { getTaskErrorMessage } from '../utils/taskErrors';
import { filterTasks, type TaskFilterState } from '../utils/filterTasks';
import { TaskFilters } from './TaskFilters';
import { TaskEmptyState } from './TaskEmptyState';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

export function TasksPanel() {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const { data: projects } = useProjects();
  const createTask = useCreateTask();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterState>({ status: 'all', priority: 'all' });

  const projectList = projects ?? [];
  const taskList = useMemo(() => tasks ?? [], [tasks]);
  const filteredTasks = useMemo(() => filterTasks(taskList, filters), [taskList, filters]);

  const handleCreate = async (values: TaskFormValues) => {
    setFormError(null);

    try {
      await createTask.mutateAsync({
        projectId: values.projectId,
        title: values.title,
        description: values.description?.trim() ? values.description : null,
        priority: (values.priority as TaskPriority | undefined) ?? 'Medium',
        status: values.status as TaskStatus | undefined,
        dueDate: values.dueDate?.trim() ? values.dueDate : null
      });
      setShowCreateForm(false);
    } catch (createError) {
      setFormError(getTaskErrorMessage(createError, 'Unable to create the task.'));
    }
  };

  if (isLoading) {
    return <RouteLoadingFallback label="Loading tasks" />;
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
        <h2 className="text-lg font-semibold text-red-900">Unable to load tasks</h2>
        <p className="mt-2 text-sm text-red-800">{getTaskErrorMessage(error, 'Please try again later.')}</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-600">Track work, priorities, and status across projects.</p>
        </div>
        {taskList.length > 0 ? (
          <Button type="button" onClick={() => setShowCreateForm((current) => !current)}>
            {showCreateForm ? 'Hide form' : 'New task'}
          </Button>
        ) : null}
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {showCreateForm ? (
        <TaskForm
          title="Create task"
          submitLabel="Create task"
          submittingLabel="Creating..."
          projects={projectList}
          errorMessage={formError}
          isSubmitting={createTask.isPending}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : null}

      {filteredTasks.length === 0 && !showCreateForm ? (
        <TaskEmptyState onCreateClick={() => setShowCreateForm(true)} />
      ) : null}

      {filteredTasks.length > 0 ? <TaskList tasks={filteredTasks} /> : null}

      {taskList.length > 0 && filteredTasks.length === 0 ? (
        <p className="text-sm text-slate-600">No tasks match the selected filters.</p>
      ) : null}
    </div>
  );
}
