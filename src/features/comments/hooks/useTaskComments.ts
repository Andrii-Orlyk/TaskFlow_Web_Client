import { useQuery } from '@tanstack/react-query';
import { commentsApi } from '../../../api/taskFlowApi';
import { commentKeys } from '../commentQueryKeys';

export function useTaskComments(taskId: string | undefined) {
  return useQuery({
    queryKey: commentKeys.byTask(taskId ?? ''),
    queryFn: () => commentsApi.list(taskId ?? ''),
    enabled: Boolean(taskId)
  });
}
