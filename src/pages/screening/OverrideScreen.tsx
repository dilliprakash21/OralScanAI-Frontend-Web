import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const overrideReasons = [
  "Clinical presentation inconsistent with AI result",
  "Image quality insufficient for accurate analysis",
  "Patient history suggests different risk level",
  "Biopsy results contradict AI assessment",
  "Technical error in image capture",
  "Other clinical reason",
];

const riskOptions: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];

export default function OverrideScreen() {
  const navigate = useNavigate();
  const { data, updateData } = useScreening();
  const [selectedRisk, setSelectedRisk] = useState<"low" | "medium" | "high">(data.riskLevel || "low");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleSave = () => {
    if (!selectedReason) { toast.error("Please select a reason for override"); return; }
    const finalReason = selectedReason === "Other clinical reason" ? customReason : selectedReason;
    if (!finalReason.trim()) { toast.error("Please provide a reason"); return; }
    updateData({
      riskLevel: selectedRisk,
      overridden: true,
      overrideReason: finalReason,
    });
    toast.success("Risk level overridden");
    navigate("/screening/referral");
  };

  const riskColors: Record<string, string> = {
    low: "border-success bg-success/10 text-success",
    medium: "border-warning bg-warning/10 text-warning",
    high: "border-destructive bg-destructive/10 text-destructive",
  };

  return (
    <MobileLayout className="pb-6">
      <ScreenHeader title="Override Result" onBack={() => navigate("/screening/results")} />
      <ProgressSteps currentStep={7} totalSteps={8} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        {/* Warning */}
        <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Clinical Override</p>
            <p className="text-xs text-muted-foreground mt-1">
              Current AI result: <span className="font-semibold capitalize">{data.riskLevel} Risk</span>. 
              Only override if clinically justified. All overrides are logged for audit purposes.
            </p>
          </div>
        </div>

        {/* Risk Selection */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">New Risk Level</p>
          <div className="grid grid-cols-3 gap-2">
            {riskOptions.map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`h-12 rounded-xl border-2 font-semibold text-sm capitalize transition-all ${
                  selectedRisk === risk ? riskColors[risk] : "border-border bg-card text-foreground"
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Reason Selection */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Reason for Override *</p>
          <div className="space-y-2">
            {overrideReasons.map((reason) => (
              <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="radio"
                  name="reason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="accent-primary"
                />
                <span className="text-sm text-foreground">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom reason */}
        {selectedReason === "Other clinical reason" && (
          <textarea
            placeholder="Describe the clinical reason..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary bg-card text-foreground outline-none text-sm resize-none"
          />
        )}

        <ActionButton onClick={handleSave}>
          Confirm Override
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
