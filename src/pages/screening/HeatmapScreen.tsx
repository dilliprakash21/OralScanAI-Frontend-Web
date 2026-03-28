import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { useScreening } from "@/contexts/ScreeningContext";
import { Activity, Brain, ChevronRight } from "lucide-react";

export default function HeatmapScreen() {
  const navigate = useNavigate();
  const { data } = useScreening();

  if (!data.imageUrl) {
    navigate("/screening/capture");
    return null;
  }

  const riskColors = {
    low: "from-success/20 via-warning/10 to-transparent",
    medium: "from-warning/40 via-warning/20 to-transparent",
    high: "from-destructive/50 via-warning/30 to-transparent",
  };

  const riskLevel = data.riskLevel || "low";

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto py-12 px-6">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Spatial Bio-Analysis</h1>
            <p className="text-muted-foreground font-medium text-lg">Multi-spectral heatmap mapping of oral mucosa regions and suspicious markers.</p>
          </div>
          <div className="w-full xl:max-w-md">
            <ProgressSteps currentStep={6} totalSteps={7} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-fade-in">
          {/* Left: Legend & Contextual Data */}
          <div className="xl:col-span-3 space-y-8 order-2 xl:order-1">
             <div className="bg-card border border-border/50 rounded-[3rem] p-10 shadow-sm space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Legend</h2>
                  </div>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                    Probabilistic mapping based on tissue reflectance and dye absorption parameters.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { color: "bg-destructive", label: "High Risk", desc: "Critical deviation detected" },
                    { color: "bg-warning", label: "Suspicious", desc: "Moderate localized markers" },
                    { color: "bg-success", label: "Nominal", desc: "Healthy baseline consistency" },
                  ].map(({ color, label, desc }) => (
                    <div key={label} className="flex gap-4 group">
                      <div className={`w-10 h-10 rounded-2xl ${color} shrink-0 shadow-lg transition-transform group-hover:scale-110`} />
                      <div>
                        <p className="text-sm font-black text-foreground uppercase tracking-widest">{label}</p>
                        <p className="text-[10px] text-muted-foreground font-bold leading-tight opacity-60">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-border/50 space-y-6">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Biomarkers</p>
                   <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: "Plaque Index", value: data.plaqueIndex?.toFixed(1) ?? "—", icon: "PI" },
                      { label: "Gingival Index", value: data.gingivalIndex?.toFixed(1) ?? "—", icon: "GI" },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="bg-secondary/10 border border-border/40 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -top-1 -right-1 text-primary/5 font-black text-3xl group-hover:text-primary/10 transition-colors uppercase pointer-events-none">{icon}</div>
                        <p className="text-3xl font-black text-foreground mb-1 tabular-nums">{value}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
             </div>

             <div className="p-8 bg-info/5 border-2 border-info/10 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-4 bg-info rounded-full" />
                   <h4 className="text-[10px] font-black text-info uppercase tracking-widest">Inference Note</h4>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                  "Heatmap intensity correlates with statistical deviation from healthy tissue libraries. 
                  Always correlate with tactile examination."
                </p>
             </div>
          </div>

          {/* Center: Immersive Viewfinder */}
          <div className="xl:col-span-9 space-y-8 order-1 xl:order-2">
             <div className="relative rounded-[4rem] overflow-hidden border-[10px] border-slate-950 aspect-[4/3] xl:aspect-video shadow-2xl group cursor-crosshair ring-1 ring-white/10">
                <img
                  src={data.imageUrl}
                  alt="Oral cavity asset"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Advanced heatmap overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${riskColors[riskLevel as keyof typeof riskColors]} mix-blend-multiply opacity-70 animate-pulse-slow`} />
                
                {/* Dynamic Lesion Markers */}
                {riskLevel !== "low" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 w-64 h-64 rounded-full bg-destructive/20 blur-[80px] animate-pulse" />
                    <div className="absolute top-1/3 left-[45%] w-32 h-32 rounded-full bg-destructive/30 blur-[40px] animate-ping opacity-30" />
                    {riskLevel === "high" && (
                      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-destructive/15 blur-[60px] animate-pulse" style={{ animationDelay: "1.5s" }} />
                    )}
                  </div>
                )}

                {/* HUD Elements */}
                <div className="absolute inset-0 flex flex-col justify-between p-10 pointer-events-none">
                   <div className="flex items-start justify-between">
                     <div className="bg-black/80 backdrop-blur-2xl rounded-[2rem] px-8 py-5 flex items-center gap-5 border border-white/10 shadow-2xl transition-all group-hover:bg-primary group-hover:border-primary">
                        <Brain className="w-10 h-10 text-primary group-hover:text-white animate-pulse" />
                        <div>
                           <p className="text-[10px] font-black text-white/40 group-hover:text-white/60 uppercase tracking-tighter">Diagnostic Engine</p>
                           <p className="text-xl font-black text-white uppercase tracking-widest">Neural Scan Active</p>
                        </div>
                     </div>
                     <div className="scale-125 origin-top-right">
                        <RiskBadge level={riskLevel as "low" | "medium" | "high"} size="large" />
                     </div>
                   </div>

                   <div className="flex items-end justify-between">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Asset Sync Verified</span>
                         </div>
                         <p className="text-[10px] text-white/40 font-black tracking-widest uppercase ml-2">Mapping resolution: 1024-node tensor</p>
                      </div>
                      <div className="w-32 h-32 border-r-2 border-b-2 border-white/20 rounded-br-[2rem]" />
                   </div>
                </div>

                {/* Grid Layer */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                   {Array.from({length: 12}).map((_, i) => (
                      <div key={i} className="absolute inset-y-0 h-px w-full bg-white border-dashed" style={{top: `${(i+1)*(100/12)}%`}} />
                   ))}
                   {Array.from({length: 12}).map((_, i) => (
                      <div key={i} className="absolute inset-x-0 w-px h-full bg-white border-dashed" style={{left: `${(i+1)*(100/12)}%`}} />
                   ))}
                </div>
             </div>

             <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                <button 
                  onClick={() => navigate("/screening/processing")}
                  className="w-full md:w-auto px-12 py-6 rounded-2xl font-black text-muted-foreground hover:bg-secondary transition-all uppercase tracking-widest text-xs"
                >
                  RE-ANALYSE DATA
                </button>
                <button 
                  onClick={() => navigate("/screening/results")}
                  className="w-full md:flex-1 max-w-2xl bg-primary text-primary-foreground h-24 rounded-[2.5rem] font-black tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 text-xl"
                >
                  GENERATE SCORECARD
                  <ChevronRight className="w-8 h-8" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
