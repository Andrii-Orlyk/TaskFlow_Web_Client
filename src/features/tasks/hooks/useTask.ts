import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../../../api/taskFlowApi';
import { taskKeys } from '../taskQueryKeys';

export function useTask(taskId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(taskId ?? ''),
    queryFn: () => tasksApi.get(taskId ?? ''),
    enabled: Boolean(taskId)
  });
}
