import { AuthFormAlert } from '../../../components/feedback/AuthFormAlert';
import { Button } from '../../../components/ui/Button';

type TaskDeleteDialogProps = {
  taskTitle: string;
  isDeleting: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function TaskDeleteDialog({ taskTitle, isDeleting, errorMessage, onConfirm, onCancel }: TaskDeleteDialogProps) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alertdialog" aria-labelledby="delete-task-title">
      <h2 id="delete-task-title" className="text-lg font-semibold text-red-900">
        Delete task
      </h2>
      <p className="mt-2 text-sm text-red-800">
        Delete <span className="font-medium">{taskTitle}</span>? This action cannot be undone.
      </p>
      <AuthFormAlert message={errorMessage ?? null} />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" className="bg-red-700 hover:bg-red-800" disabled={isDeleting} onClick={onConfirm}>
          {isDeleting ? 'Deleting...' : 'Confirm delete'}
        </Button>
        <Button type="button" className="bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </section>
  );
}
