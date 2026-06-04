import type { PropsWithChildren } from 'react';

type ErrorStatePanelProps = PropsWithChildren<{
  title: string;
  message: string;
}>;

export function ErrorStatePanel({ title, message, children }: ErrorStatePanelProps) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
      <h2 className="text-lg font-semibold text-red-900">{title}</h2>
      <p className="mt-2 text-sm text-red-800">{message}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
