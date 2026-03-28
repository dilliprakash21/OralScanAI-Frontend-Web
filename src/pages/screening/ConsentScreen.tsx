import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground mb-1">Patient Consent</h1>
          <p className="text-muted-foreground font-medium">Step 1 of the screening protocol</p>
        </div>

        <ProgressSteps currentStep={1} totalSteps={7} />

        <div className="mt-8 bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm space-y-8 animate-fade-in">
          {/* Icon + Title */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Informed Consent</h2>
              <p className="text-muted-foreground font-medium mt-1">
                Please review and explain the following protocol to the patient
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-secondary/30 rounded-3xl p-6 space-y-4">
              {consentPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-4 bg-info/5 border border-info/10 rounded-2xl p-6">
              <FileText className="w-6 h-6 text-info shrink-0 mt-0.5" />
              <p className="text-sm text-info/80 leading-relaxed font-medium">
                This screening is conducted under applicable clinical guidelines. OralScan AI is a 
                decision-support tool and does not replace professional clinical judgment.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-4 p-6 rounded-3xl border-2 border-border/50 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-6 h-6 border-2 border-border rounded-lg accent-primary cursor-pointer transition-all"
              />
            </div>
            <span className="text-foreground font-bold leading-relaxed group-hover:text-primary transition-colors">
              Patient has been fully informed and verbally consents to the screening procedure and data processing.
            </span>
          </label>

          <div className="pt-4">
            <button 
              onClick={handleProceed} 
              disabled={!agreed}
              className={`w-full py-5 rounded-[1.5rem] font-black tracking-widest uppercase transition-all shadow-xl shadow-primary/20 ${
                agreed 
                  ? "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }`}
            >
              PROCEED TO PATIENT DETAILS
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
