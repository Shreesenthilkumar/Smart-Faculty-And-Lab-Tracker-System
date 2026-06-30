export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-paper border border-hairline rounded-md shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
