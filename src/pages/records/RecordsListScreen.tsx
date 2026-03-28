import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    <DashboardLayout>
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">Patient Records</h1>
            <p className="text-muted-foreground font-medium">Browse and manage all historical screening data</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={exportCSV}
              className="px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all flex items-center gap-2"
            >
              Export Data CSV
            </button>
            <button 
              onClick={() => navigate("/new-screening")}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              New Screening
            </button>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm mb-8">
          <div className="relative mb-6">
            <Input
              placeholder="Search by patient ID, name, or phone number..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-border/50 bg-secondary/30 focus:bg-background transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Results: {filtered.length} found</span>
            <div className="h-px flex-1 bg-border/30"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center bg-secondary/10 rounded-[2.5rem] border border-dashed border-border/50">
              <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-30"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">No records matched</h3>
              <p className="text-muted-foreground mt-1 px-10">Try adjusting your search filters or search for a generic term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/records/${r.id}`)}
                  className="w-full bg-background border border-border/40 rounded-[2rem] p-6 flex flex-col items-start gap-4 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="w-full flex justify-between items-start">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary transition-colors"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <RiskBadge level={r.risk_level || "low"} />
                  </div>
                  
                  <div className="text-left w-full">
                    <h3 className="font-black text-xl text-foreground truncate">{r.patient_name || "Anonymous Patient"}</h3>
                    <p className="text-sm font-bold text-muted-foreground uppercase opacity-70 tracking-tighter mt-1">ID: {r.patient_id}</p>
                    
                    <div className="mt-4 pt-4 border-t border-border/30 w-full flex items-center justify-between">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic truncate">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Date unknown"}
                      </p>
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-all font-bold text-xs uppercase underline underline-offset-4">
                        View Report
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
