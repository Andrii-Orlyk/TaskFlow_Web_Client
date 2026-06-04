type RouteLoadingFallbackProps = {
  label?: string;
};

export function RouteLoadingFallback({ label = 'Loading page' }: RouteLoadingFallbackProps) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}
