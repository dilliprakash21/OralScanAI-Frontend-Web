import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useScreening } from "@/contexts/ScreeningContext";
import { toast } from "sonner";

const stages = [
  { label: "Preprocessing image...", duration: 1200 },
  { label: "Detecting lesion regions...", duration: 1500 },
  { label: "Generating heatmap...", duration: 1300 },
  { label: "Calculating risk indices...", duration: 1000 },
  { label: "Finalising results...", duration: 800 },
];

const ANALYZE_URL = (import.meta.env.VITE_ANALYZE_URL || "http://10.147.66.242:8000").replace(/\/$/, "");

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, data] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] || "image/jpeg";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function mapRiskLevel(raw: string | undefined): "low" | "medium" | "high" {
  const v = (raw || "").toLowerCase();
  // Flask may return: Low/Moderate/High/Severe
  if (v.includes("low")) return "low";
  if (v.includes("moderate") || v.includes("medium")) return "medium";
  if (v.includes("high") || v.includes("severe")) return "high";
  return "low";
}

export default function ProcessingScreen() {
  const navigate = useNavigate();
  const { data, updateData } = useScreening();
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data.imageUrl) { navigate("/screening/capture"); return; }

    let elapsed = 0;
    const totalDuration = stages.reduce((s, st) => s + st.duration, 0);
    let currentStage = 0;

    const interval = setInterval(() => {
      elapsed += 80;
      setProgress(Math.min((elapsed / totalDuration) * 100, 99));

      let stageCumulative = 0;
      for (let i = 0; i < stages.length; i++) {
        stageCumulative += stages[i].duration;
        if (elapsed < stageCumulative) { setStageIndex(i); break; }
        currentStage = i;
      }
    }, 80);

    const timer = setTimeout(async () => {
      clearInterval(interval);

      try {
        // Convert the captured base64 image into a real file upload
        const blob = dataUrlToBlob(data.imageUrl!);
        const file = new File([blob], "capture.jpg", { type: blob.type || "image/jpeg" });

        const form = new FormData();
        form.append("file", file);

        const res = await fetch(`${ANALYZE_URL}/analyze`, {
          method: "POST",
          body: form,
        });

        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload?.error || "Analysis failed");

        updateData({
          riskLevel: mapRiskLevel(payload?.risk_level || payload?.riskLevel),
          aiConfidence: typeof (payload?.ai_confidence ?? payload?.aiConfidence) === "number" 
            ? (payload?.ai_confidence ?? payload?.aiConfidence) 
            : undefined,
          plaqueIndex: typeof (payload?.plaque_index ?? payload?.plaqueIndex) === "number" 
            ? (payload?.plaque_index ?? payload?.plaqueIndex) 
            : undefined,
          gingivalIndex: typeof (payload?.gingival_index ?? payload?.gingivalIndex) === "number" 
            ? (payload?.gingival_index ?? payload?.gingivalIndex) 
            : undefined,
        });
        setProgress(100);
        setTimeout(() => navigate("/screening/heatmap"), 400);
      } catch (e) {
        console.error(e);
        const errMsg = e instanceof Error ? e.message : "Failed to analyze image";
        toast.error(errMsg);
        setError(errMsg);
      }
    }, totalDuration);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[75vh] py-12 px-4 animate-fade-in relative overflow-hidden">
        {/* Immersive Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow ml-20" />
        
        <div className="max-w-3xl w-full text-center space-y-16 relative z-10">
          {/* Advanced Neural Scanner Animation */}
          <div className="relative w-72 h-72 mx-auto group">
             {/* Rotating Rings */}
             <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
             <div className="absolute inset-4 rounded-full border border-primary/10 animate-reverse-spin" />
             <div className="absolute inset-8 rounded-full bg-primary/5 backdrop-blur-3xl shadow-2xl border border-white/10" />
             
             {/* Scanning Line */}
             <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="w-full h-1 bg-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.8)] animate-scan-line" />
             </div>

             {/* Center Brain/Node Icon */}
             <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path className="animate-pulse" d="M12 8v8M8 12h8" />
                  <circle cx="12" cy="12" r="3" className="fill-primary/20 animate-ping" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeDasharray="2 2" />
                </svg>
             </div>

             {/* Percentage Pulse */}
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background border border-border/50 px-6 py-2 rounded-full shadow-xl">
                <span className="text-lg font-black text-foreground tabular-nums">{Math.round(progress)}%</span>
             </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
               Synthesizing <br/>Clinical Indices
            </h2>
            <p className="text-muted-foreground font-medium text-xl max-w-xl mx-auto leading-relaxed opacity-80">
               Our diagnostic engine is correlating multi-spectral data points with 
               curated clinical libraries.
            </p>
          </div>

          {error ? (
            <div className="w-full space-y-10 animate-in zoom-in duration-500">
              <div className="p-10 bg-destructive/5 text-destructive rounded-[2.5rem] text-center border-2 border-destructive/20 shadow-2xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                   <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </div>
                <p className="font-black text-2xl uppercase tracking-tighter">Analysis Interrupted</p>
                <p className="font-medium text-lg leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => navigate("/screening/capture")}
                className="group px-16 py-6 bg-primary text-primary-foreground rounded-[2rem] font-black tracking-[0.3em] uppercase hover:scale-[1.05] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 mx-auto"
              >
                RESTORE SESSION
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          ) : (
            <div className="w-full space-y-8 px-8 md:px-24">
              <div className="h-4 bg-secondary/20 rounded-full overflow-hidden border border-border/40 p-0.5">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_30px_rgba(var(--primary),0.6)] relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full animate-progress-shimmer" />
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                 <div className="flex items-center gap-3 bg-secondary/10 border border-border/50 px-8 py-3 rounded-2xl shadow-sm">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   <span className="text-sm font-black text-primary uppercase tracking-[0.2em] animate-fade-in" key={stageIndex}>
                     {stages[Math.min(stageIndex, stages.length - 1)]?.label}
                   </span>
                 </div>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">
                    Secure Cloud Handshake Active
                 </p>
              </div>
            </div>
          )}

          <div className="pt-16 opacity-40 hover:opacity-100 transition-opacity duration-500">
             <div className="max-w-md mx-auto p-6 rounded-[2rem] bg-secondary/10 border border-border/40 backdrop-blur-sm">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] leading-relaxed">
                   AI Decision Support System (DSS) <br/>
                   Compliance level: clinical parity standard v2.1 <br/>
                   Validation required by medical authority.
                </p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
