import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { useScreening } from "@/contexts/ScreeningContext";
import { AlertCircle, ChevronRight, Info } from "lucide-react";

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
    <MobileLayout className="pb-6">
      <ScreenHeader title="Screening Results" onBack={() => navigate("/screening/heatmap")} />
      <ProgressSteps currentStep={7} totalSteps={8} />

      <div className="px-4 pt-4 space-y-4 animate-fade-in">
        {/* Risk Card */}
        <div className={`rounded-2xl border-2 p-5 ${riskInfo.color}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <RiskBadge level={riskLevel} size="large" />
              <p className="text-sm text-foreground mt-3 leading-relaxed">{riskInfo.desc}</p>
            </div>
            <div className="ml-3 text-center">
              <p className="text-3xl font-bold text-foreground">{data.aiConfidence}%</p>
              <p className="text-xs text-muted-foreground">AI Confidence</p>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Patient Information</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Name", value: data.patientName || "—" },
              { label: "Age / Gender", value: `${data.age || "—"} / ${data.gender || "—"}` },
              { label: "Patient ID", value: data.patientId || "—" },
              { label: "Location", value: data.location || "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground capitalize truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Indices */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Clinical Indices</p>
          <div className="space-y-2">
            {[
              { label: "Plaque Index (PI)", value: data.plaqueIndex, max: 3, warn: 2 },
              { label: "Gingival Index (GI)", value: data.gingivalIndex, max: 3, warn: 2 },
              { label: "AI Confidence Score", value: (data.aiConfidence || 0) / 100, max: 1, warn: 0.5 },
            ].map(({ label, value, max, warn }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-semibold ${(value || 0) >= warn ? "text-warning" : "text-success"}`}>
                    {label.includes("Confidence") ? `${data.aiConfidence}%` : (value || 0).toFixed(1)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${(value || 0) >= warn ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${((value || 0) / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-accent rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Recommendation</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{riskInfo.recommendation}</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 px-1">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI results are indicative only. Clinical judgment must be applied before any medical decision.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <ActionButton onClick={() => navigate("/screening/override")} variant="outline">
            Override AI Result
          </ActionButton>
          {riskLevel !== "low" && (
            <ActionButton onClick={() => navigate("/screening/referral")}>
              Refer Patient <ChevronRight className="w-4 h-4" />
            </ActionButton>
          )}
          {riskLevel === "low" && (
            <ActionButton onClick={() => navigate("/screening/save")}>
              Save Record
            </ActionButton>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
