import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-chalk flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-slate text-sm mb-2">404</p>
        <h1 className="font-display text-3xl text-ink mb-4">Page not found</h1>
        <Link to="/dashboard" className="text-sm text-ink underline underline-offset-2 hover:text-slate">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
