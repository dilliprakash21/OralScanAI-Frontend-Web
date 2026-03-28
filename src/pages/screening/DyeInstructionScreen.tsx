import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">Dye Application Protocol</h1>
            <p className="text-muted-foreground font-medium">Step 3: Preparing the oral mucosa with Toluidine Blue</p>
          </div>
          <div className="flex-1 md:max-w-xs">
            <ProgressSteps currentStep={3} totalSteps={7} />
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-12 animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-8 border-b border-border/30 pb-8">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0">
              <Droplets className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Toluidine Blue Procedure</h2>
              <p className="text-muted-foreground font-medium mt-1 leading-relaxed">
                Follow these clinical steps meticulously to ensure high-contrast imaging of suspicious lesions. 
                Proper application is critical for AI-assisted diagnostic accuracy.
              </p>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="group flex items-start gap-6 bg-secondary/20 hover:bg-secondary/30 border border-border/50 rounded-3xl p-6 transition-all duration-300">
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-foreground text-lg mb-1">{step.title}</p>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-1">
                   <div className="w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timer Card */}
            <div className="bg-warning/5 border border-warning/20 rounded-3xl p-6 flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-lg font-black text-foreground">Procedure Time: ~2 min</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                  Allow sufficient time for dye penetration. Ensure proper intra-oral lighting 
                  is available before moving to image capture.
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-6 flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-lg font-black text-destructive">Contraindications</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                   Do not use Toluidine Blue on patients with known hypersensitivity to 
                   methylene blue or related phenothiazine dye compounds.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex items-center justify-between gap-6">
            <button 
              onClick={() => navigate("/screening/patient-details")}
              className="px-8 py-5 rounded-[1.5rem] font-black text-muted-foreground hover:bg-secondary transition-all"
            >
              BACK
            </button>
            <button 
              onClick={() => navigate("/screening/capture-guide")} 
              className="flex-1 max-w-md bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              DYE APPLIED — CONTINUE TO GUIDE
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
