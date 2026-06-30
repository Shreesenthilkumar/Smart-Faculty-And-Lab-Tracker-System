import { useState } from "react";
import { useDebounce } from "use-debounce";
import useLabData from "../hooks/useLabData";
import { updateLabStatus } from "../api/labs";
import { getLabStatusMeta } from "../lib/status";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { Search, RefreshCw } from "lucide-react";

const LAB_STATUSES = ["FREE", "OCCUPIED", "MAINTENANCE"];

function LabCard({ lab, canUpdate, onUpdated }) {
  const meta = getLabStatusMeta(lab.status);
  const [editing, setEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(lab.status);
  const [count, setCount] = useState(lab.occupiedCount ?? 0);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await updateLabStatus(lab.labId, { status: newStatus, occupiedCount: count });
      setEditing(false);
      onUpdated();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-display text-base text-ink leading-tight">{lab.labName}</p>
          <p className="text-xs text-slate font-mono mt-0.5">{lab.departmentName || "—"}</p>
        </div>
        <StatusBadge meta={meta} />
      </div>

      <div className="text-xs text-slate grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        <span><span className="text-ink/50 mr-1">Capacity</span><span className="font-mono">{lab.capacity}</span></span>
        <span><span className="text-ink/50 mr-1">Present</span><span className="font-mono">{lab.occupiedCount ?? 0}</span></span>
        {lab.labInchargeName && (
          <span className="col-span-2"><span className="text-ink/50 mr-1">Incharge</span>{lab.labInchargeName}</span>
        )}
      </div>

      {canUpdate && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="mt-4 text-xs font-medium text-slate border border-hairline rounded-sm px-3 py-1 hover:text-ink hover:border-ink transition-colors"
        >
          Update status
        </button>
      )}

      {editing && (
        <div className="mt-4 space-y-2 border-t border-hairline pt-4">
          <div className="flex gap-2">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 text-xs border border-hairline rounded-sm px-2 py-1.5 bg-paper font-mono focus:outline-none focus:border-ink"
            >
              {LAB_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={lab.capacity}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              className="w-20 text-xs border border-hairline rounded-sm px-2 py-1.5 bg-paper font-mono focus:outline-none focus:border-ink"
              placeholder="Count"
            />
          </div>
          {err && <p className="text-brick-red text-xs">{err}</p>}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 text-xs font-semibold bg-ink text-chalk rounded-sm py-1.5 hover:bg-ink-soft transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-slate border border-hairline rounded-sm px-3 py-1.5 hover:text-ink hover:border-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function LabListPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const { labs, loading, error, refresh } = useLabData(debouncedSearch);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Labs</h1>
          <p className="text-sm text-slate mt-0.5">Live occupancy — updates in real time</p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 text-sm text-slate border border-hairline rounded-sm px-3 py-1.5 hover:text-ink hover:border-ink transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm font-mono border border-hairline rounded-sm bg-paper focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-brick-red text-sm">{error}</p>}
      {!loading && !error && labs.length === 0 && (
        <EmptyState title="No labs found" hint={search ? "Try a different name." : "No labs have been added yet."} />
      )}
      {!loading && !error && labs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((l) => (
            <LabCard
              key={l.labId}
              lab={l}
              canUpdate={user?.role === "ADMIN" || (user?.role === "LAB_INCHARGE" && l.labInchargeUserId === user.userId)}
              onUpdated={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
