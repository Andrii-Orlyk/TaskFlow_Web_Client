import { Button } from '../../../components/ui/Button';

type ProjectEmptyStateProps = {
  onCreateClick: () => void;
};

export function ProjectEmptyState({ onCreateClick }: ProjectEmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">No projects yet</h2>
      <p className="mt-2 text-sm text-slate-600">Create your first project to organize tasks.</p>
      <Button type="button" className="mt-4" onClick={onCreateClick}>
        Create project
      </Button>
    </section>
  );
}
