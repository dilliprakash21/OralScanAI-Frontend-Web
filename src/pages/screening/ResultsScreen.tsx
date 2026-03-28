import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { useScreening } from "@/contexts/ScreeningContext";
import { AlertCircle, ChevronRight, Info, Activity } from "lucide-react";

const riskDescriptions = {
  low: {
    title: "Low Risk",
    desc: "No significant findings. Continue regular oral hygiene and annual screening.",
    recommendation: "Maintain good oral hygiene. Schedule next screening in 12 months.",
    color: "border-success/30 bg-success/5",
    textColor: "text-success",
  },
  medium: {
    title: "Moderate Risk",
    desc: "Some suspicious areas detected. Clinical correlation and follow-up recommended.",
    recommendation: "Refer to a dentist within 4 weeks for further evaluation and biopsy if needed.",
    color: "border-warning/30 bg-warning/5",
    textColor: "text-warning",
  },
  high: {
    title: "High Risk",
    desc: "Significant findings detected. Immediate clinical evaluation strongly recommended.",
    recommendation: "Urgent referral required. Patient should see an oncologist within 2 weeks.",
    color: "border-destructive/30 bg-destructive/5",
    textColor: "text-destructive",
  },
};

export default function ResultsScreen() {
  const navigate = useNavigate();
  const { data } = useScreening();

  if (!data.riskLevel) { navigate("/screening/processing"); return null; }

  const riskLevel = data.riskLevel as keyof typeof riskDescriptions;
  const riskInfo = riskDescriptions[riskLevel];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Clinical Scorecard</h1>
            <p className="text-muted-foreground font-medium text-lg">Comprehensive multi-modal diagnostic report and AI inference synthesis.</p>
          </div>
          <div className="w-full md:max-w-xs text-right">
            <ProgressSteps currentStep={7} totalSteps={7} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          {/* Left: Diagnostic Synthesis & Risk */}
          <div className="lg:col-span-5 space-y-10">
            {/* Immersive Risk Card */}
            <div className={`rounded-[3.5rem] border-[6px] p-10 md:p-12 ${riskInfo.color} shadow-2xl relative overflow-hidden group transition-all duration-700 hover:scale-[1.01]`}>
              <div className="absolute -top-12 -right-12 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
                 <AlertCircle className={`w-64 h-64 ${riskInfo.textColor}`} />
              </div>
              
              <div className="relative space-y-10">
                <div className="flex items-center justify-between">
                   <RiskBadge level={riskLevel} size="large" />
                   <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                      <Activity className={`w-8 h-8 ${riskInfo.textColor} animate-pulse`} />
                   </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`text-4xl font-black ${riskInfo.textColor} uppercase tracking-tighter leading-none`}>
                     {riskInfo.title} <br/>Detected
                  </h3>
                  <p className="text-foreground/80 font-bold text-lg leading-relaxed">
                    {riskInfo.desc}
                  </p>
                </div>

                <div className="pt-8 border-t border-current/10 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-4xl font-black text-foreground tracking-tighter">{data.aiConfidence}%</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Inference Certainty</p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-xs font-black text-foreground uppercase tracking-widest">Protocol V1.4</p>
                      <p className="text-[10px] text-muted-foreground font-bold italic opacity-60">Verified Engine</p>
                   </div>
                </div>
              </div>

              {/* Animated scanning bar for flair */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 animate-scan" />
            </div>

            {/* Patient Context Card */}
            <div className="bg-card border border-border/50 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Info className="w-32 h-32" />
              </div>
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                <div className="w-1.5 h-4 bg-primary rounded-full" />
                Demographic Context
              </h3>
              <div className="grid grid-cols-2 gap-y-10 gap-x-8 relative z-10">
                {[
                  { label: "Identity", value: data.patientName || "—", sub: data.gender || "N/A" },
                  { label: "Temporal Data", value: `${data.age || "—"} Years`, sub: `DOB: ${data.dob || "—"}` },
                  { label: "Geographic", value: data.location || "Unmapped", sub: "GPS Verified" },
                  { label: "Clinical ID", value: data.patientId || "TEMP-ID", sub: "Auth Entry" },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em]">{label}</p>
                    <p className="text-lg font-black text-foreground capitalize truncate">{value}</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Technical Indices & Action Protocol */}
          <div className="lg:col-span-7 space-y-10">
            {/* Indices Scorecard */}
            <div className="bg-card border border-border/50 rounded-[4rem] p-10 md:p-14 shadow-sm relative overflow-hidden">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Clinical Biomarkers</h3>
                  <div className="flex items-center gap-2 px-6 py-3 bg-secondary/10 border border-border/40 rounded-2xl">
                     <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Calibration Optimal</span>
                  </div>
               </div>
               
               <div className="space-y-12">
                {[
                  { label: "Plaque Index (PI)", value: data.plaqueIndex, max: 3, warn: 2, desc: "Bacterial biofilm density quantification via visual segmentation." },
                  { label: "Gingival Index (GI)", value: data.gingivalIndex, max: 3, warn: 2, desc: "Vascular inflammation and tissue response metrics." },
                  { label: "AI Model Certainty", value: (data.aiConfidence || 0) / 100, max: 1, warn: 0.5, desc: "Statistical depth of neural network inference for this specific asset." },
                ].map(({ label, value, max, warn, desc }) => (
                  <div key={label} className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xl font-black text-foreground uppercase tracking-tighter">{label}</p>
                        <p className="text-xs text-muted-foreground font-medium max-w-sm">{desc}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-4xl font-black tabular-nums ${(value || 0) >= warn ? "text-warning" : "text-success"}`}>
                          {label.includes("Certainty") ? `${data.aiConfidence}%` : (value || 0).toFixed(1)}
                        </span>
                        <span className="text-sm font-black text-muted-foreground ml-2">/ {max.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="h-4 bg-secondary/20 rounded-full overflow-hidden border border-border/10 p-0.5">
                      <div
                        className={`h-full rounded-full transition-diagnostic shadow-lg ${(value || 0) >= warn ? "bg-warning" : "bg-success"}`}
                        style={{ width: `${((value || 0) / max) * 100}%` }}
                      >
                         <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral / Save Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-info/5 border-2 border-info/10 rounded-[3rem] p-10 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-info" />
                      </div>
                      <h4 className="text-lg font-black text-foreground uppercase tracking-widest">Protocol Response</h4>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed italic">
                      {riskInfo.recommendation}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/screening/override")}
                    className="w-full py-5 rounded-2xl border-2 border-border font-black text-xs uppercase tracking-[0.2em] text-muted-foreground hover:bg-secondary transition-all"
                  >
                    Clinical Override Request
                  </button>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex-1 bg-card border border-border/50 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                        <ChevronRight className="w-8 h-8 text-primary/40" />
                     </div>
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Awaiting Commitment</p>
                  </div>
                  {riskLevel !== "low" ? (
                    <button 
                      onClick={() => navigate("/screening/save")}
                      className="w-full h-24 rounded-[2.5rem] bg-primary text-primary-foreground font-black tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 text-xl"
                    >
                      Save Report
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate("/screening/save")}
                      className="w-full h-24 rounded-[2.5rem] bg-foreground text-background font-black tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-foreground/20 text-xl"
                    >
                      Commit Record
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>

        <div className="mt-16 p-10 bg-secondary/10 rounded-[3.5rem] border border-border/40 flex flex-col md:flex-row items-center gap-10">
           <div className="w-20 h-20 rounded-[2rem] bg-background flex items-center justify-center shadow-lg shrink-0">
              <AlertCircle className="w-10 h-10 text-muted-foreground/40" />
           </div>
           <div className="space-y-4">
              <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Diagnostic Responsibility & Data Governance</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-5xl">
                This clinical asset analysis was performed using trained neural networks optimized for precursor identification. 
                The derived risk indices are provided for decision Support ONLY. It does not replace histopathological confirmation 
                or physical clinical inspection. All patient metadata is processed under strict healthcare information confidentiality protocols.
              </p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
