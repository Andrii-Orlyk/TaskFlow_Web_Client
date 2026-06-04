import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RouteLoadingFallback } from '../../../components/feedback/RouteLoadingFallback';
import { Button } from '../../../components/ui/Button';
import { ApiClientError } from '../../../lib/apiErrors';
import { useProject } from '../hooks/useProject';
import { useDeleteProject, useUpdateProject } from '../hooks/useProjectMutations';
import { getProjectErrorMessage } from '../utils/projectErrors';
import type { ProjectFormValues } from '../schemas/projectSchemas';
import { ProjectDeleteDialog } from './ProjectDeleteDialog';
import { ProjectForm } from './ProjectForm';

export function ProjectDetailsPanel() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const updateProject = useUpdateProject(projectId ?? '');
  const deleteProject = useDeleteProject();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!projectId) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
        <p className="text-sm text-red-800">Project id is missing.</p>
      </section>
    );
  }

  if (isLoading) {
    return <RouteLoadingFallback label="Loading project" />;
  }

  if (isError) {
    const isNotFound = error instanceof ApiClientError && (error.kind === 'notFound' || error.status === 404);

    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{isNotFound ? 'Project not found' : 'Unable to load project'}</h1>
        <p className="mt-2 text-sm text-slate-600">{getProjectErrorMessage(error, 'Please try again later.')}</p>
        <Link to="/projects" className="mt-4 inline-flex text-sm font-medium text-slate-900 hover:underline">
          Back to projects
        </Link>
      </section>
    );
  }

  if (!project) {
    return null;
  }

  const handleUpdate = async (values: ProjectFormValues) => {
    setFormError(null);

    try {
      await updateProject.mutateAsync({
        name: values.name,
        description: values.description ?? null
      });
      setIsEditing(false);
    } catch (updateError) {
      setFormError(getProjectErrorMessage(updateError, 'Unable to update the project.'));
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);

    try {
      await deleteProject.mutateAsync(project.id);
      navigate('/projects', { replace: true });
    } catch (deleteErr) {
      setDeleteError(getProjectErrorMessage(deleteErr, 'Unable to delete the project.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Back to projects
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{project.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            {project.description?.trim() ? project.description : 'No description provided.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? 'Cancel edit' : 'Edit project'}
          </Button>
          <Button type="button" className="bg-red-700 hover:bg-red-800" onClick={() => setShowDeleteDialog(true)}>
            Delete
          </Button>
        </div>
      </div>

      {isEditing ? (
        <ProjectForm
          title="Edit project"
          submitLabel="Save changes"
          submittingLabel="Saving..."
          defaultValues={{
            name: project.name,
            description: project.description ?? ''
          }}
          errorMessage={formError}
          isSubmitting={updateProject.isPending}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : null}

      {showDeleteDialog ? (
        <ProjectDeleteDialog
          projectName={project.name}
          isDeleting={deleteProject.isPending}
          errorMessage={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
        <p className="mt-2 text-sm text-slate-600">
          Create, edit, and update task status from the tasks workspace. Tasks are linked to this project by project
          selection when you create or edit a task.
        </p>
        <Link
          to="/tasks"
          className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          View tasks
        </Link>
      </section>
    </div>
  );
}
