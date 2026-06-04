import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../../../api/taskFlowApi';
import { projectKeys } from '../projectQueryKeys';

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(projectId ?? ''),
    queryFn: () => projectsApi.get(projectId!),
    enabled: Boolean(projectId)
  });
}
