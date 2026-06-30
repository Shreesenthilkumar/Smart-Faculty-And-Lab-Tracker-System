import StatusLight from "./StatusLight";

/**
 * A light + label pill, e.g. "● Available". Pass a meta object from
 * src/lib/status.js ({ label, color, live }).
 */
export default function StatusBadge({ meta, subtle = false }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
      style={{
        backgroundColor: subtle ? "transparent" : `${meta.color}1A`,
        color: meta.color,
      }}
    >
      <StatusLight color={meta.color} live={meta.live} />
      {meta.label}
    </span>
  );
}
