import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../../../api/taskFlowApi';
import type { CreateProjectRequest, UpdateProjectRequest } from '../../../types/api';
import { projectKeys } from '../projectQueryKeys';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectRequest) => projectsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectRequest) => projectsApi.update(projectId, payload),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(projectId), project);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsApi.remove(projectId),
    onSuccess: (_result, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
}
