import { useState } from 'react';
import { RouteLoadingFallback } from '../../../components/feedback/RouteLoadingFallback';
import { useAddComment, useDeleteComment } from '../hooks/useCommentMutations';
import { useTaskComments } from '../hooks/useTaskComments';
import type { CommentFormValues } from '../schemas/commentSchemas';
import { getCommentErrorMessage } from '../utils/commentErrors';
import { CommentEmptyState } from './CommentEmptyState';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

type CommentsSectionProps = {
  taskId: string;
};

export function CommentsSection({ taskId }: CommentsSectionProps) {
  const { data: comments, isLoading, isError, error } = useTaskComments(taskId);
  const addComment = useAddComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const handleAdd = async (values: CommentFormValues) => {
    setFormError(null);

    try {
      await addComment.mutateAsync({ content: values.content.trim() });
    } catch (addError) {
      setFormError(getCommentErrorMessage(addError, 'Unable to add the comment.'));
    }
  };

  const handleDelete = async (commentId: string) => {
    setDeleteError(null);
    setDeletingCommentId(commentId);

    try {
      await deleteComment.mutateAsync(commentId);
    } catch (deleteErr) {
      setDeleteError(getCommentErrorMessage(deleteErr, 'Unable to delete the comment.'));
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">Comments</h2>

      {isLoading ? <RouteLoadingFallback label="Loading comments" /> : null}

      {isError ? (
        <p className="mt-3 text-sm text-red-800" role="alert">
          {getCommentErrorMessage(error, 'Failed to load comments.')}
        </p>
      ) : null}

      {deleteError ? (
        <p className="mt-3 text-sm text-red-800" role="alert">
          {deleteError}
        </p>
      ) : null}

      {!isLoading && !isError ? (
        <div className="mt-4 space-y-4">
          {(comments ?? []).length === 0 ? <CommentEmptyState /> : null}
          {(comments ?? []).length > 0 ? (
            <CommentList comments={comments ?? []} deletingCommentId={deletingCommentId} onDelete={handleDelete} />
          ) : null}
          <CommentForm errorMessage={formError} isSubmitting={addComment.isPending} onSubmit={handleAdd} />
        </div>
      ) : null}
    </section>
  );
}
