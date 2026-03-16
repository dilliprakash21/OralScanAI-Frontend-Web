import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { Droplets, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: "💧", title: "Apply 1% Toluidine Blue", desc: "Apply a thin layer uniformly to the entire oral mucosa" },
  { icon: "⏱️", title: "Wait 30 seconds", desc: "Allow dye to bind to suspicious tissue" },
  { icon: "💦", title: "Rinse with 1% Acetic Acid", desc: "Rinse thoroughly to remove excess dye" },
  { icon: "👁️", title: "Observe Retention", desc: "Dark blue retention indicates high-risk areas" },
];

export default function DyeInstructionScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout className="pb-6">
      <ScreenHeader title="Dye Application" onBack={() => navigate("/screening/patient-details")} />
      <ProgressSteps currentStep={3} totalSteps={8} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 py-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Toluidine Blue Dye</h2>
            <p className="text-muted-foreground text-sm mt-1">Follow these steps carefully before image capture</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-card rounded-xl border border-border p-4">
              <span className="text-2xl">{step.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{step.title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{step.desc}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-muted-foreground/30 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Timer Card */}
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Total Time: ~2 minutes</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure proper lighting before capturing the image
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Contraindication:</span> Do not use Toluidine Blue on patients 
            with known allergy to the dye or methylene blue compounds.
          </p>
        </div>

        <ActionButton onClick={() => navigate("/screening/capture-guide")}>
          Dye Applied — Continue
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
