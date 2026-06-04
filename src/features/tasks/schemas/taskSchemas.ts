import { z } from 'zod';
import type { TaskPriority, TaskStatus } from '../../../types/api';

const taskStatusValues = ['Todo', 'InProgress', 'Done', 'Cancelled'] as const satisfies readonly TaskStatus[];
const taskPriorityValues = ['Low', 'Medium', 'High', 'Critical'] as const satisfies readonly TaskPriority[];

export const taskFormSchema = z.object({
  projectId: z.string().min(1, 'Project is required.'),
  title: z.string().trim().min(1, 'Task title is required.').max(200, 'Task title must be 200 characters or fewer.'),
  description: z.string().max(2000, 'Description must be 2000 characters or fewer.').optional(),
  status: z.enum(taskStatusValues).optional(),
  priority: z.enum(taskPriorityValues).optional(),
  dueDate: z.string().optional()
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
