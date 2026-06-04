import type { CommentDto } from '../../../types/api';
import { CommentItem } from './CommentItem';

type CommentListProps = {
  comments: CommentDto[];
  deletingCommentId: string | null;
  onDelete: (commentId: string) => Promise<void>;
};

export function CommentList({ comments, deletingCommentId, onDelete }: CommentListProps) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isDeleting={deletingCommentId === comment.id}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
