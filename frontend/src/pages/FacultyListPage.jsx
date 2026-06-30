import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import useFacultyData from "../hooks/useFacultyData";
import { getFacultyStatusMeta, getLocationLabel } from "../lib/status";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { Search, RefreshCw } from "lucide-react";

function FacultyCard({ member }) {
  const meta = getFacultyStatusMeta(member.status);
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-display text-base text-ink leading-tight">{member.facultyName}</p>
          <p className="text-xs text-slate font-mono mt-0.5">{member.departmentName || "—"}</p>
        </div>
        <StatusBadge meta={meta} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-slate">
        <span>
          <span className="text-ink/50 mr-1">Cabin</span>
          <span className="font-mono">{member.cabinNumber || "—"}</span>
        </span>
        <span>
          <span className="text-ink/50 mr-1">Location</span>
          {getLocationLabel(member.location)}
        </span>
        {member.phone && (
          <span>
            <span className="text-ink/50 mr-1">Phone</span>
            <span className="font-mono">{member.phone}</span>
          </span>
        )}
      </div>
    </Card>
  );
}

export default function FacultyListPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const { faculty, loading, error, refresh } = useFacultyData(debouncedSearch);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Faculty</h1>
          <p className="text-sm text-slate mt-0.5">Live availability — updates in real time</p>
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
      {!loading && !error && faculty.length === 0 && (
        <EmptyState title="No faculty found" hint={search ? "Try a different name." : "No faculty profiles have been added yet."} />
      )}
      {!loading && !error && faculty.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((m) => (
            <FacultyCard key={m.facultyId} member={m} />
          ))}
        </div>
      )}
    </div>
  );
}
