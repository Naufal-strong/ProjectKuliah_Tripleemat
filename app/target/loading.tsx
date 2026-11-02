export default function LoadingTarget() {
  return (
    <div className="mx-auto max-w-6xl p-8 text-center" role="status" aria-live="polite">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      <p className="mt-4 text-sm text-slate-400">Memuat data target audit dari PostgreSQL...</p>
    </div>
  );
}
