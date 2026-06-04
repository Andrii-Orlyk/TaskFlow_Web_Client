import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../../../api/taskFlowApi';
import { projectKeys } from '../projectQueryKeys';

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectsApi.list()
  });
}
