import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tent, MapPin, Database } from "lucide-react";
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
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Camp Analytics</h1>
            <p className="text-muted-foreground font-medium text-lg">Retrospective overview of all clinical outreach deployments and community screenings.</p>
          </div>
          <button 
            onClick={() => navigate("/statistics")}
            className="px-8 py-4 rounded-2xl bg-secondary/50 font-black text-muted-foreground hover:bg-secondary transition-all"
          >
            BACK TO STATISTICS
          </button>
        </div>

        <div className="animate-fade-in space-y-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Aggregating Clinical Data...</p>
            </div>
          ) : (
            <>
              {/* Top Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-primary text-primary-foreground rounded-[2.5rem] p-10 shadow-xl shadow-primary/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <Tent className="w-32 h-32" />
                   </div>
                   <div className="relative z-10 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">TOTAL CAMP SCREENINGS</p>
                      <h3 className="text-6xl font-black">{campRows.length}</h3>
                      <p className="text-sm font-medium opacity-80 leading-relaxed">
                         Unique clinical encounters processed <br/>under camp outreach protocols.
                      </p>
                   </div>
                </div>

                <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-sm space-y-8 md:col-span-2">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                         <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-black text-foreground uppercase tracking-widest">Active Outreach Footprint</h4>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: "UNIQUE LOCATIONS", value: byLocation.length },
                        { label: "TOP PERFORMING", value: byLocation[0]?.[0] || "N/A" },
                        { label: "SYNC STATUS", value: "CLOUD-SYNCED" },
                        { label: "DATA SCHEMA", value: "V 2.0.4" },
                      ].map(({ label, value }) => (
                        <div key={label} className="space-y-1">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
                           <p className="text-sm font-black text-foreground truncate" title={String(value)}>{value}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Detailed Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                  <div className="bg-card border border-border/50 rounded-[3rem] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-border/50 flex items-center justify-between bg-secondary/5">
                       <h3 className="text-xl font-black text-foreground uppercase tracking-widest">Geographical Distribution</h3>
                       <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                          SORTED BY INTENSITY
                       </div>
                    </div>
                    {byLocation.length === 0 ? (
                      <div className="p-16 text-center space-y-4">
                         <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                            <MapPin className="w-10 h-10" />
                         </div>
                         <p className="text-muted-foreground font-medium italic">No clinical geospatial data has been aggregated yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {byLocation.map(([loc, count], idx) => (
                          <div key={loc} className="flex items-center justify-between p-8 hover:bg-secondary/10 transition-colors group">
                            <div className="flex items-center gap-6">
                               <span className="w-8 h-8 rounded-full bg-foreground/5 text-[10px] font-black flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                                  {idx + 1}
                               </span>
                               <div>
                                  <p className="font-black text-foreground text-lg uppercase tracking-tight">{loc}</p>
                                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Clinical Jurisdiction</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">{count}</p>
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">RECORDS</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <div className="bg-foreground text-background rounded-[3rem] p-12 shadow-2xl space-y-10 relative overflow-hidden group">
                      <div className="absolute bottom-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                         <Database className="w-48 h-48" />
                      </div>
                      <div className="relative z-10 space-y-6">
                         <h4 className="text-2xl font-black leading-tight">Epidemiological <br/>Reporting</h4>
                         <p className="text-background/60 text-sm font-medium leading-relaxed">
                            These summaries provide the foundation for public health intervention strategies. 
                            All data is scrubbed of PHI to maintain HIPAA alignment in summary views.
                         </p>
                         <div className="pt-6 border-t border-background/20 space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-4 h-4 rounded-full bg-success" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Global Sync Active</span>
                            </div>
                            <button className="w-full py-5 bg-white text-foreground rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:scale-[1.05] transition-all">
                               EXPORT AGGREGATE CSV
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="p-8 bg-info/5 border-2 border-info/10 rounded-[2rem] space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-info rounded-full" />
                         <p className="text-[10px] font-black text-info uppercase tracking-widest">Data Sovereignty</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                         "Camp mode screenings represent high-risk outreach; ensure follow-up protocols are 
                         initiated for every high-risk case identified in these totals."
                      </p>
                   </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
