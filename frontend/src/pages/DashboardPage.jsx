import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/dashboard";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusLight from "../components/StatusLight";

function StatTile({ label, value, color, live }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate font-medium">{label}</p>
        <StatusLight color={color} live={live} />
      </div>
      <p className="font-display text-4xl text-ink">{value ?? "—"}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setData)
      .catch(() => setError("Could not load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-brick-red text-sm">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-1">Dashboard</h1>
      <p className="text-sm text-slate mb-8">Current status snapshot across campus</p>

      <section className="mb-10">
        <h2 className="font-display text-lg text-ink mb-4">Faculty</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatTile label="Total" value={data.totalFaculty} color="#5b6b82" />
          <StatTile label="Available" value={data.availableFaculty} color="#2e7d5b" live />
          <StatTile label="Busy" value={data.busyFaculty} color="#c97b2e" />
          <StatTile label="In Class" value={data.inClassFaculty} color="#c97b2e" />
          <StatTile label="In Meeting" value={data.inMeetingFaculty} color="#c97b2e" />
          <StatTile label="On Leave" value={data.onLeaveFaculty} color="#a6402f" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-ink mb-4">Labs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatTile label="Total Labs" value={data.totalLabs} color="#5b6b82" />
          <StatTile label="Free" value={data.freeLabs} color="#2e7d5b" live />
          <StatTile label="Occupied" value={data.occupiedLabs} color="#c97b2e" />
          <StatTile label="Maintenance" value={data.maintenanceLabs} color="#a6402f" />
        </div>
      </section>
    </div>
  );
}
