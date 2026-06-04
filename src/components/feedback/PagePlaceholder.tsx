type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      <p className="mt-4 text-sm text-slate-500">Route shell is ready. Feature logic connects in later phases.</p>
    </section>
  );
}
