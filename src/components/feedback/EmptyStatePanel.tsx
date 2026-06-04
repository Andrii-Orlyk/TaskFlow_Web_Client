import type { PropsWithChildren } from 'react';

type EmptyStatePanelProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function EmptyStatePanel({ title, description, children }: EmptyStatePanelProps) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {children ? <div className="mt-4 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </section>
  );
}
