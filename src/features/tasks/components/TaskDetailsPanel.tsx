import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RouteLoadingFallback } from '../../../components/feedback/RouteLoadingFallback';
import { Button } from '../../../components/ui/Button';
import { ApiClientError } from '../../../lib/apiErrors';
import { CommentsSection } from '../../comments/components/CommentsSection';
import { useProject } from '../../projects/hooks/useProject';
import { useProjects } from '../../projects/hooks/useProjects';
import type { TaskPriority, TaskStatus } from '../../../types/api';
import { useDeleteTask, useUpdateTask } from '../hooks/useTaskMutations';
import { useTask } from '../hooks/useTask';
import type { TaskFormValues } from '../schemas/taskSchemas';
import { getTaskErrorMessage } from '../utils/taskErrors';
import { TaskDeleteDialog } from './TaskDeleteDialog';
import { TaskDueDateLabel } from './TaskDueDateLabel';
import { TaskForm } from './TaskForm';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskStatusActions } from './TaskStatusActions';
import { TaskStatusBadge } from './TaskStatusBadge';

export function TaskDetailsPanel() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { data: task, isLoading, isError, error } = useTask(taskId);
  const { data: projects } = useProjects();
  const { data: project } = useProject(task?.projectId);
  const updateTask = useUpdateTask(taskId ?? '');
  const deleteTask = useDeleteTask();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!taskId) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
        <p className="text-sm text-red-800">Task id is missing.</p>
      </section>
    );
  }

  if (isLoading) {
    return <RouteLoadingFallback label="Loading task" />;
  }

  if (isError) {
    const isNotFound = error instanceof ApiClientError && (error.kind === 'notFound' || error.status === 404);

    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{isNotFound ? 'Task not found' : 'Unable to load task'}</h1>
        <p className="mt-2 text-sm text-slate-600">{getTaskErrorMessage(error, 'Please try again later.')}</p>
        <Link to="/tasks" className="mt-4 inline-flex text-sm font-medium text-slate-900 hover:underline">
          Back to tasks
        </Link>
      </section>
    );
  }

  if (!task) {
    return null;
  }

  const handleUpdate = async (values: TaskFormValues) => {
    setFormError(null);

    try {
      await updateTask.mutateAsync({
        title: values.title,
        description: values.description?.trim() ? values.description : null,
        status: values.status as TaskStatus | undefined,
        priority: (values.priority as TaskPriority | undefined) ?? task.priority,
        dueDate: values.dueDate?.trim() ? values.dueDate : null
      });
      setIsEditing(false);
    } catch (updateError) {
      setFormError(getTaskErrorMessage(updateError, 'Unable to update the task.'));
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);

    try {
      await deleteTask.mutateAsync(task.id);
      navigate('/tasks', { replace: true });
    } catch (deleteErr) {
      setDeleteError(getTaskErrorMessage(deleteErr, 'Unable to delete the task.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/tasks" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Back to tasks
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{task.title}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            {task.description?.trim() ? task.description : 'No description provided.'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
            <TaskDueDateLabel task={task} />
          </div>
          {project ? (
            <p className="mt-3 text-sm text-slate-600">
              Project:{' '}
              <Link to={`/projects/${project.id}`} className="font-medium text-slate-900 hover:underline">
                {project.name}
              </Link>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? 'Cancel edit' : 'Edit task'}
          </Button>
          <Button type="button" className="bg-red-700 hover:bg-red-800" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </Button>
        </div>
      </div>

      <TaskStatusActions taskId={task.id} status={task.status} />

      {isEditing ? (
        <TaskForm
          title="Edit task"
          submitLabel="Save changes"
          submittingLabel="Saving..."
          projects={projects ?? []}
          showStatusField
          defaultValues={{
            projectId: task.projectId,
            title: task.title,
            description: task.description ?? '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
          }}
          errorMessage={formError}
          isSubmitting={updateTask.isPending}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : null}

      {showDeleteDialog ? (
        <TaskDeleteDialog
          taskTitle={task.title}
          isDeleting={deleteTask.isPending}
          errorMessage={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      ) : null}

      <CommentsSection taskId={task.id} />
    </div>
  );
}
