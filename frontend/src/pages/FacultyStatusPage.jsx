import { useState, useEffect } from "react";
import { updateMyAvailability } from "../api/availability";
import { getFaculty } from "../api/faculty";
import { useAuth } from "../context/AuthContext";
import { getFacultyStatusMeta, getLocationLabel } from "../lib/status";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUSES = ["AVAILABLE", "BUSY", "IN_CLASS", "IN_MEETING", "ON_LEAVE"];
const LOCATIONS = ["CABIN", "LAB", "CLASSROOM", "MEETING_HALL", "OUTSIDE_CAMPUS"];

export default function FacultyStatusPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState("AVAILABLE");
  const [location, setLocation] = useState("CABIN");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCurrentStatus() {
      if (!user?.email) return;
      try {
        const list = await getFaculty();
        const mine = list.find((f) => f.email === user.email);
        if (mine) {
          setStatus(mine.status || "AVAILABLE");
          setLocation(mine.location || "CABIN");
        }
      } catch (err) {
        // Fallback silently
      } finally {
        setLoading(false);
      }
    }
    loadCurrentStatus();
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      await updateMyAvailability({ status, location });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status.");
    } finally {
      setSaving(false);
    }
  }

  const previewMeta = getFacultyStatusMeta(status);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl text-ink mb-1">My Status</h1>
      <p className="text-sm text-slate mb-8">
        Update your current availability — students and colleagues see this instantly.
      </p>

      <Card className="p-6 mb-6">
        <p className="text-sm text-slate mb-1">Signed in as</p>
        <p className="font-display text-lg text-ink">{user?.name}</p>
        <p className="text-xs font-mono text-slate mt-0.5">{user?.email}</p>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg text-ink mb-5">Update availability</h2>

        {success && (
          <div className="mb-4 rounded-sm border border-signal-green/30 bg-signal-green-soft px-4 py-3 text-sm text-signal-green">
            Status updated successfully.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-sm border border-brick-red/30 bg-brick-red-soft px-4 py-3 text-sm text-brick-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-paper font-mono focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{getFacultyStatusMeta(s).label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-paper font-mono focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{getLocationLabel(l)}</option>
              ))}
            </select>
          </div>

          <div className="pt-1">
            <p className="text-xs text-slate mb-2">Preview</p>
            <StatusBadge meta={previewMeta} />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-sm bg-ink text-chalk text-sm font-semibold py-2.5 hover:bg-ink-soft transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save status"}
          </button>
        </form>
      </Card>
    </div>
  );
}
