import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../../../api/taskFlowApi';
import type { CreateCommentRequest } from '../../../types/api';
import { commentKeys } from '../commentQueryKeys';
import { taskKeys } from '../../tasks/taskQueryKeys';

export function useAddComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentRequest) => commentsApi.create(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    }
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.remove(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    }
  });
}
