import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Input } from "@/components/ui/input";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function RecordsListScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.screenings.list({ limit: 200, q: q.trim() || undefined });
      setRecords(res.screenings || []);
    } catch (err: any) {
      toast({ title: "Failed to load records", description: err?.message, variant: "destructive" });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return records;
    return records.filter((r) =>
      String(r.patient_id || "").toLowerCase().includes(s) ||
      String(r.patient_name || "").toLowerCase().includes(s) ||
      String(r.phone || "").toLowerCase().includes(s)
    );
  }, [q, records]);

  const exportCSV = async () => {
    // NOTE: Supabase version verified password before export. In MySQL mode we export directly.
    const res = await api.screenings.list({ limit: 1000 });
    const rows = res.screenings || [];
    const headers = [
      "id","patient_id","patient_name","phone","age","dob","gender","location","mode",
      "plaque_index","gingival_index","ai_confidence","risk_level","created_at"
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "screenings_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Downloaded screenings_export.csv" });
  };

  return (
    <MobileLayout showBottomNav={true}>
      <ScreenHeader title="Records" onBack={() => navigate("/dashboard")} />

      <div className="p-4 space-y-4 pb-24">
        <Input
          placeholder="Search by patient id, name or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="flex justify-end">
          <button className="text-sm text-primary underline underline-offset-4" onClick={exportCSV}>
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-xl p-6 text-center">
            <p className="text-muted-foreground">No records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/records/${r.id}`)}
                className="w-full bg-card rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="text-left">
                  <p className="font-semibold">{r.patient_name || `Patient ID: ${r.patient_id}`}</p>
                  <p className="text-sm text-muted-foreground">ID: {r.patient_id}</p>
                </div>
                <RiskBadge risk={r.risk_level || "low"} />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </MobileLayout>
  );
}
