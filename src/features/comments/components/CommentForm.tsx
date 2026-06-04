import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthFormAlert } from '../../../components/feedback/AuthFormAlert';
import { Button } from '../../../components/ui/Button';
import { commentFormSchema, type CommentFormValues } from '../schemas/commentSchemas';

type CommentFormProps = {
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSubmit: (values: CommentFormValues) => Promise<void>;
};

export function CommentForm({ errorMessage, isSubmitting = false, onSubmit }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: '' }
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
    reset({ content: '' });
  });

  return (
    <form className="space-y-3" onSubmit={submitHandler} noValidate>
      <AuthFormAlert message={errorMessage ?? null} />
      <div>
        <label htmlFor="comment-content" className="block text-sm font-medium text-slate-700">
          Add comment
        </label>
        <textarea
          id="comment-content"
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          aria-invalid={Boolean(errors.content)}
          {...register('content')}
        />
        {errors.content?.message ? (
          <p className="mt-1 text-sm text-red-700" role="alert">
            {errors.content.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post comment'}
      </Button>
    </form>
  );
}
