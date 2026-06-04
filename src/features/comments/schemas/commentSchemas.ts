import { z } from 'zod';

export const commentFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty.')
    .max(2000, 'Comment must be 2000 characters or fewer.')
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
