import { useState } from 'react';
import type { CommentDto } from '../../../types/api';
import { Button } from '../../../components/ui/Button';

type CommentItemProps = {
  comment: CommentDto;
  isDeleting: boolean;
  onDelete: (commentId: string) => Promise<void>;
};

export function CommentItem({ comment, isDeleting, onDelete }: CommentItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await onDelete(comment.id);
    setShowConfirm(false);
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-800">{comment.content}</p>
      <p className="mt-2 text-xs text-slate-500">Posted {new Date(comment.createdAt).toLocaleString()}</p>

      {showConfirm ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" className="bg-red-700 hover:bg-red-800" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? 'Deleting...' : 'Confirm delete'}
          </Button>
          <Button
            type="button"
            className="bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="button" className="mt-3 bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50" onClick={() => setShowConfirm(true)}>
          Delete comment
        </Button>
      )}
    </article>
  );
}
