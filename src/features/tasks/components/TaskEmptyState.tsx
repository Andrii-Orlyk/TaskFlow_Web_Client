import { Button } from '../../../components/ui/Button';

type TaskEmptyStateProps = {
  onCreateClick: () => void;
};

export function TaskEmptyState({ onCreateClick }: TaskEmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">No tasks yet</h2>
      <p className="mt-2 text-sm text-slate-600">Create a task to start tracking work.</p>
      <Button type="button" className="mt-4" onClick={onCreateClick}>
        Create task
      </Button>
    </section>
  );
}
