import { Button } from '../../../components/ui/Button';

type ProjectDeleteDialogProps = {
  projectName: string;
  isDeleting: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ProjectDeleteDialog({
  projectName,
  isDeleting,
  errorMessage,
  onConfirm,
  onCancel
}: ProjectDeleteDialogProps) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm" role="alertdialog" aria-labelledby="delete-project-title">
      <h2 id="delete-project-title" className="text-lg font-semibold text-red-900">
        Delete project
      </h2>
      <p className="mt-2 text-sm text-red-800">
        Delete <span className="font-medium">{projectName}</span>? This action cannot be undone.
      </p>
      {errorMessage ? <p className="mt-2 text-sm text-red-700">{errorMessage}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" className="bg-red-700 hover:bg-red-800" disabled={isDeleting} onClick={onConfirm}>
          {isDeleting ? 'Deleting...' : 'Confirm delete'}
        </Button>
        <Button
          type="button"
          className="bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
          disabled={isDeleting}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}
