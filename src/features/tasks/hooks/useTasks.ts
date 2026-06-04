import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../../../api/taskFlowApi';
import { taskKeys } from '../taskQueryKeys';

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: () => tasksApi.list()
  });
}
