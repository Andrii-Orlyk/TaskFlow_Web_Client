export const commentKeys = {
  all: ['comments'] as const,
  byTask: (taskId: string) => [...commentKeys.all, taskId] as const
};
