/**
 * The app's signature element — a small recessed indicator light styled
 * after a physical office-door occupancy lamp. `live` adds a soft pulsing
 * halo to mark the "good to approach" states (Available / Free).
 */
export default function StatusLight({ color = "#5b6b82", live = false, size = "0.7rem" }) {
  return (
    <span
      className={`status-light ${live ? "is-live" : ""}`}
      style={{ backgroundColor: color, color, width: size, height: size }}
      aria-hidden="true"
    />
  );
}
