import { useState } from 'react';
import { RouteLoadingFallback } from '../../../components/feedback/RouteLoadingFallback';
import { Button } from '../../../components/ui/Button';
import { useCreateProject } from '../hooks/useProjectMutations';
import { useProjects } from '../hooks/useProjects';
import { getProjectErrorMessage } from '../utils/projectErrors';
import type { ProjectFormValues } from '../schemas/projectSchemas';
import { ProjectEmptyState } from './ProjectEmptyState';
import { ProjectForm } from './ProjectForm';
import { ProjectList } from './ProjectList';

export function ProjectsPanel() {
  const { data: projects, isLoading, isError, error } = useProjects();
  const createProject = useCreateProject();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async (values: ProjectFormValues) => {
    setFormError(null);

    try {
      await createProject.mutateAsync({
        name: values.name,
        description: values.description ?? null
      });
      setShowCreateForm(false);
    } catch (createError) {
      setFormError(getProjectErrorMessage(createError, 'Unable to create the project.'));
    }
  };

  if (isLoading) {
    return <RouteLoadingFallback label="Loading projects" />;
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
        <h2 className="text-lg font-semibold text-red-900">Unable to load projects</h2>
        <p className="mt-2 text-sm text-red-800">{getProjectErrorMessage(error, 'Please try again later.')}</p>
      </section>
    );
  }

  const projectList = projects ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-600">Manage project workspaces for your tasks.</p>
        </div>
        {projectList.length > 0 ? (
          <Button type="button" onClick={() => setShowCreateForm((current) => !current)}>
            {showCreateForm ? 'Hide form' : 'New project'}
          </Button>
        ) : null}
      </div>

      {showCreateForm ? (
        <ProjectForm
          title="Create project"
          submitLabel="Create project"
          submittingLabel="Creating..."
          errorMessage={formError}
          isSubmitting={createProject.isPending}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : null}

      {projectList.length === 0 && !showCreateForm ? (
        <ProjectEmptyState onCreateClick={() => setShowCreateForm(true)} />
      ) : null}

      {projectList.length > 0 ? <ProjectList projects={projectList} /> : null}
    </div>
  );
}
