import type { InputHTMLAttributes } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({ id, label, error, className, ...inputProps }: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={[
          'mt-1 w-full rounded-xl border px-3 py-2 text-sm',
          error ? 'border-red-400' : 'border-slate-300',
          className
        ]
          .filter(Boolean)
          .join(' ')}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
