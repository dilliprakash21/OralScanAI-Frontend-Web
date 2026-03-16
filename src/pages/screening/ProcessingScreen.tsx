import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
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
          riskLevel: mapRiskLevel(payload?.riskLevel),
          aiConfidence: typeof payload?.aiConfidence === "number" ? payload.aiConfidence : undefined,
          plaqueIndex: typeof payload?.plaqueIndex === "number" ? payload.plaqueIndex : undefined,
          gingivalIndex: typeof payload?.gingivalIndex === "number" ? payload.gingivalIndex : undefined,
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
    <MobileLayout className="items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-8 px-8 text-center">
        {/* Animated brain/scan */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-primary-foreground/20 animate-pulse-ring" />
          <div className="absolute inset-4 rounded-full bg-primary-foreground/20 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-0 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <svg className="w-14 h-14 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V5a1 1 0 0 0 1 1 2 2 0 0 1 0 4 1 1 0 0 0-1 1v.5A2.5 2.5 0 0 1 9.5 14h-1A2.5 2.5 0 0 1 6 11.5V11a1 1 0 0 0-1-1 2 2 0 0 1 0-4 1 1 0 0 0 1-1v-.5A2.5 2.5 0 0 1 8.5 2h1z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v.5" />
              <path d="M14.5 14A2.5 2.5 0 0 0 12 11.5V11" />
              <path d="M15 7h1.5A2.5 2.5 0 0 1 19 9.5v1a2.5 2.5 0 0 1-2.5 2.5H15" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-foreground">Analysing</h2>
          <p className="text-primary-foreground/70 mt-1 text-sm">AI is processing the oral cavity image</p>
        </div>

        {error ? (
          <div className="w-full max-w-xs space-y-4">
            <div className="p-4 bg-destructive/90 text-destructive-foreground rounded-xl text-center font-semibold border border-destructive/50">
              {error}
            </div>
            <button
              onClick={() => navigate("/screening/capture")}
              className="w-full px-6 py-3 bg-primary-foreground text-primary rounded-full font-bold shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs space-y-2">
            <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-foreground rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-primary-foreground/60">
              <span>{stages[Math.min(stageIndex, stages.length - 1)]?.label}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        <p className="text-xs text-primary-foreground/50 max-w-xs">
          This AI analysis is a decision-support tool and does not replace clinical judgment.
        </p>
      </div>
    </MobileLayout>
  );
}
