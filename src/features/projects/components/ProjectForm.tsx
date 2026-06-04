import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthFormAlert } from '../../../components/feedback/AuthFormAlert';
import { FormField } from '../../../components/feedback/FormField';
import { Button } from '../../../components/ui/Button';
import { projectFormSchema, type ProjectFormValues } from '../schemas/projectSchemas';

type ProjectFormProps = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  defaultValues?: ProjectFormValues;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel?: () => void;
};

export function ProjectForm({
  title,
  submitLabel,
  submittingLabel,
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onSubmit,
  onCancel
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      ...defaultValues
    }
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthFormAlert message={errorMessage ?? null} />

        <FormField
          id="project-name"
          label="Project name"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label htmlFor="project-description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="project-description"
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            aria-invalid={Boolean(errors.description)}
            {...register('description')}
          />
          {errors.description?.message ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
          {onCancel ? (
            <Button type="button" className="bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
