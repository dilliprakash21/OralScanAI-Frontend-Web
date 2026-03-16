import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { useScreening } from "@/contexts/ScreeningContext";
import { Activity, Brain } from "lucide-react";

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
    <MobileLayout className="pb-6">
      <ScreenHeader title="AI Heatmap" onBack={() => navigate("/screening/processing")} />
      <ProgressSteps currentStep={6} totalSteps={8} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        {/* Heatmap Image */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-border aspect-[4/3]">
          <img
            src={data.imageUrl}
            alt="Oral cavity"
            className="w-full h-full object-cover"
          />
          {/* Simulated heatmap overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${riskColors[riskLevel as keyof typeof riskColors]} mix-blend-multiply`} />
          {/* Simulated lesion markers */}
          {riskLevel !== "low" && (
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-1/2 w-12 h-12 rounded-full bg-destructive/40 blur-md animate-pulse" />
              {riskLevel === "high" && (
                <div className="absolute top-1/2 left-1/3 w-8 h-8 rounded-full bg-destructive/50 blur-sm animate-pulse" style={{ animationDelay: "0.5s" }} />
              )}
            </div>
          )}
          {/* AI Label */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-white text-xs font-semibold">AI Analysis</span>
          </div>
          <div className="absolute top-3 right-3">
            <RiskBadge level={riskLevel as "low" | "medium" | "high"} />
          </div>
        </div>

        {/* Legend */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Heatmap Legend
          </p>
          <div className="flex gap-3">
            {[
              { color: "bg-success", label: "Normal" },
              { color: "bg-warning", label: "Suspicious" },
              { color: "bg-destructive", label: "High Risk" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Indices Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Risk Level", value: riskLevel?.toUpperCase(), highlight: true },
            { label: "Plaque Index", value: data.plaqueIndex?.toFixed(1) ?? "—" },
            { label: "Gingival Index", value: data.gingivalIndex?.toFixed(1) ?? "—" },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-3 text-center">
              <p className={`font-bold text-lg ${highlight ? (riskLevel === "high" ? "text-destructive" : riskLevel === "medium" ? "text-warning" : "text-success") : "text-foreground"}`}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <ActionButton onClick={() => navigate("/screening/results")}>
          View Detailed Results
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
