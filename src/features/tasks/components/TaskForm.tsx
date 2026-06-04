import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthFormAlert } from '../../../components/feedback/AuthFormAlert';
import { FormField } from '../../../components/feedback/FormField';
import { Button } from '../../../components/ui/Button';
import type { ProjectDto } from '../../../types/api';
import { TASK_PRIORITY_OPTIONS, getTaskPriorityLabel } from '../utils/taskPriority';
import { TASK_STATUS_OPTIONS, getTaskStatusLabel } from '../utils/taskStatus';
import { taskFormSchema, type TaskFormValues } from '../schemas/taskSchemas';

type TaskFormProps = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  projects: ProjectDto[];
  defaultValues?: TaskFormValues;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  showStatusField?: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
};

export function TaskForm({
  title,
  submitLabel,
  submittingLabel,
  projects,
  defaultValues,
  errorMessage,
  isSubmitting = false,
  showStatusField = false,
  onSubmit,
  onCancel
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      projectId: '',
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      ...defaultValues
    }
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthFormAlert message={errorMessage ?? null} />

        <div>
          <label htmlFor="task-project" className="block text-sm font-medium text-slate-700">
            Project
          </label>
          <select
            id="task-project"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            aria-invalid={Boolean(errors.projectId)}
            {...register('projectId')}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId?.message ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {errors.projectId.message}
            </p>
          ) : null}
        </div>

        <FormField id="task-title" label="Task title" error={errors.title?.message} {...register('title')} />

        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            aria-invalid={Boolean(errors.description)}
            {...register('description')}
          />
          {errors.description?.message ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select id="task-priority" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" {...register('priority')}>
              {TASK_PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {getTaskPriorityLabel(priority)}
                </option>
              ))}
            </select>
          </div>

          <FormField id="task-due-date" label="Due date" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
        </div>

        {showStatusField ? (
          <div>
            <label htmlFor="task-status" className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select id="task-status" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" {...register('status')}>
              {TASK_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {getTaskStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
          {onCancel ? (
            <Button type="button" className="bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
