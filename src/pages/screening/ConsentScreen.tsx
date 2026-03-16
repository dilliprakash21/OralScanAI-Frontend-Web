import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { Shield, FileText, CheckCircle } from "lucide-react";

const consentPoints = [
  "Images captured will be used solely for oral health screening purposes",
  "AI analysis provides decision support only — not a clinical diagnosis",
  "Data is stored securely and accessible only to the screening practitioner",
  "Patient has the right to withdraw consent at any time",
  "Results will be shared with the patient and relevant healthcare providers",
];

export default function ConsentScreen() {
  const navigate = useNavigate();
  const { updateData } = useScreening();
  const [agreed, setAgreed] = useState(false);

  const handleProceed = () => {
    updateData({ consentGiven: true });
    navigate("/screening/patient-details");
  };

  return (
    <MobileLayout className="pb-6">
      <ScreenHeader title="Patient Consent" onBack={() => navigate("/dashboard")} />
      <ProgressSteps currentStep={1} totalSteps={8} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Informed Consent</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Please explain the following to the patient before proceeding
            </p>
          </div>
        </div>

        {/* Consent Points */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          {consentPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        {/* Legal Note */}
        <div className="flex items-start gap-3 bg-accent rounded-xl p-4">
          <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This screening is conducted under applicable clinical guidelines. OralScan AI is a 
            decision-support tool and does not replace professional clinical judgment.
          </p>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-border cursor-pointer active:bg-muted/50 transition-colors">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-5 h-5 accent-primary rounded"
          />
          <span className="text-sm text-foreground font-medium leading-relaxed">
            Patient has been informed and verbally consents to the screening procedure
          </span>
        </label>

        <ActionButton onClick={handleProceed} disabled={!agreed}>
          Proceed to Patient Details
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
