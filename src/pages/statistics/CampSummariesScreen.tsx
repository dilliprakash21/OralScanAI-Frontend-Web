import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { api } from "@/lib/api";

export default function CampSummariesScreen() {
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

  const campRows = useMemo(
    () => rows.filter((r) => String(r.mode || "").toLowerCase().includes("camp")),
    [rows]
  );

  const byLocation = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of campRows) {
      const key = (r.location || "Unknown").trim();
      m.set(key, (m.get(key) || 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [campRows]);

  return (
    <MobileLayout showBottomNav={true}>
      <ScreenHeader title="Camp Summaries" onBack={() => navigate("/statistics")} />

      <div className="p-4 space-y-4 pb-24">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className="bg-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Camp screenings</p>
              <p className="text-2xl font-bold">{campRows.length}</p>
            </div>

            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-3">Top camp locations</h3>
              {byLocation.length === 0 ? (
                <p className="text-sm text-muted-foreground">No camp data yet.</p>
              ) : (
                <div className="space-y-2">
                  {byLocation.slice(0, 10).map(([loc, count]) => (
                    <div key={loc} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{loc}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </MobileLayout>
  );
}
