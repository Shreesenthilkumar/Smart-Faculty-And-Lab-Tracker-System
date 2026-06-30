import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusLight from "../components/StatusLight";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-chalk flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header / Brand */}
        <div className="mb-8 text-center">
          <div className="flex justify-center gap-3 mb-4">
            <StatusLight color="#2e7d5b" live size="0.9rem" />
            <StatusLight color="#c97b2e" size="0.9rem" />
            <StatusLight color="#a6402f" size="0.9rem" />
          </div>
          <h1 className="font-display text-3xl text-ink">Faculty &amp; Lab Tracker</h1>
          <p className="text-sm text-slate mt-1">Real-time campus availability</p>
        </div>

        <div className="bg-paper border border-hairline rounded-md shadow-sm p-8">
          <h2 className="font-display text-xl text-ink mb-6">Sign in</h2>

          {error && (
            <div className="mb-4 rounded-sm border border-brick-red/30 bg-brick-red-soft px-4 py-3 text-sm text-brick-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-hairline bg-chalk px-3 py-2 text-sm font-mono text-ink placeholder-slate/50 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                placeholder="you@college.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-hairline bg-chalk px-3 py-2 text-sm font-mono text-ink placeholder-slate/50 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-sm bg-ink text-chalk text-sm font-semibold py-2.5 hover:bg-ink-soft transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-xs text-slate text-center font-mono">
            Default password for all seeded accounts: <span className="text-ink">Password123!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
