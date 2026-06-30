export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-3 text-slate py-10 justify-center">
      <span
        className="inline-block h-4 w-4 rounded-full border-2 border-hairline border-t-ink animate-spin"
        aria-hidden="true"
      />
      <span className="text-sm font-mono">{label}</span>
    </div>
  );
}
