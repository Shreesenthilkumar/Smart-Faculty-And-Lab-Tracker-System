export default function EmptyState({ title, hint }) {
  return (
    <div className="text-center py-14 px-6 border border-dashed border-hairline rounded-md">
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      {hint && <p className="text-sm text-slate">{hint}</p>}
    </div>
  );
}
