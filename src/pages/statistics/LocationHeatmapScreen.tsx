import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { api } from "@/lib/api";

export default function LocationHeatmapScreen() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.screenings.list({ limit: 5000 });
        setRows(res.screenings || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const m = new Map<string, { location: string; count: number; high: number }>();
    for (const r of rows) {
      const loc = (r.location || "Unknown").trim();
      const entry = m.get(loc) || { location: loc, count: 0, high: 0 };
      entry.count += 1;
      if (String(r.risk_level || "").toLowerCase() === "high") entry.high += 1;
      m.set(loc, entry);
    }
    return Array.from(m.values()).sort((a, b) => b.count - a.count);
  }, [rows]);

  return (
    <MobileLayout showBottomNav={true}>
      <ScreenHeader title="Location Summary" onBack={() => navigate("/statistics")} />

      <div className="p-4 space-y-4 pb-24">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : grouped.length === 0 ? (
          <div className="bg-card rounded-xl p-6 text-center">
            <p className="text-muted-foreground">No data yet</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl p-4">
            <h3 className="font-semibold mb-3">By location</h3>
            <div className="space-y-2 text-sm">
              {grouped.slice(0, 30).map((g) => (
                <div key={g.location} className="flex justify-between">
                  <span className="text-muted-foreground">{g.location}</span>
                  <span className="font-medium">
                    {g.count} <span className="text-muted-foreground">({g.high} high)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileLayout>
  );
}
