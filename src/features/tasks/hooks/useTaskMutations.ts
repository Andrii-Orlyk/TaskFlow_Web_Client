import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../../api/taskFlowApi';
import type { CreateTaskRequest, TaskStatus, UpdateTaskRequest } from '../../../types/api';
import { projectKeys } from '../../projects/projectQueryKeys';
import { taskKeys } from '../taskQueryKeys';

function invalidateTaskQueries(queryClient: ReturnType<typeof useQueryClient>, taskId?: string) {
  queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });

  if (taskId) {
    queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
  }
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskRequest) => tasksApi.create(payload),
    onSuccess: (task) => {
      invalidateTaskQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(task.projectId) });
    }
  });
}

export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskRequest) => tasksApi.update(taskId, payload),
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(taskId), task);
      invalidateTaskQueries(queryClient, taskId);
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(task.projectId) });
    }
  });
}

export function useUpdateTaskStatus(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: TaskStatus) => tasksApi.updateStatus(taskId, { status }),
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(taskId), task);
      invalidateTaskQueries(queryClient, taskId);
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(task.projectId) });
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.remove(taskId),
    onSuccess: (_result, taskId) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
      invalidateTaskQueries(queryClient);
    }
  });
}
