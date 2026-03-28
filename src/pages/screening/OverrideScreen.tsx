import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { AlertCircle, CheckCircle } from "lucide-react";
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
    navigate("/screening/save");
  };

  const riskColors: Record<string, string> = {
    low: "border-success bg-success/10 text-success",
    medium: "border-warning bg-warning/10 text-warning",
    high: "border-destructive bg-destructive/10 text-destructive",
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Clinical Decision Override</h1>
            <p className="text-muted-foreground font-medium text-lg">Manual calibration of AI inference results based on practitioner evaluation.</p>
          </div>
          <div className="w-full xl:max-w-md">
            <ProgressSteps currentStep={7} totalSteps={7} />
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[4rem] p-10 md:p-16 shadow-2xl space-y-16 animate-fade-in relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-[100px] -mr-32 -mt-32" />

          {/* Critical Warning Header */}
          <div className="flex flex-col md:flex-row items-center gap-10 bg-warning/5 border-4 border-warning/20 rounded-[3rem] p-10 relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-warning/10 flex items-center justify-center shrink-0 shadow-lg">
               <AlertCircle className="w-12 h-12 text-warning" />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Medico-Legal Protocol Acknowledgement</h2>
              <p className="text-muted-foreground font-bold leading-relaxed max-w-3xl">
                You are manually overriding an automated <span className="text-warning font-black uppercase tracking-tighter mx-1">{data.riskLevel} Risk</span> assessment. 
                This action constitutes a professional clinical judgment and will be permanently logged 
                with your practitioner credentials. Ensure visual correlation and patient history align with this modification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 relative z-10">
            {/* Left: Risk Selection */}
            <div className="xl:col-span-5 space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Corrected Risk Level</h3>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">Select the risk category that aligns with your clinical inspection.</p>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {riskOptions.map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setSelectedRisk(risk)}
                      className={`group relative flex items-center justify-between p-8 rounded-[2.5rem] border-4 transition-all duration-500 ${
                        selectedRisk === risk 
                          ? riskColors[risk].split(' ')[0] + " " + riskColors[risk].split(' ')[1] + " shadow-2xl scale-[1.02]"
                          : "border-border bg-secondary/10 hover:border-primary/30 hover:bg-secondary/20"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                         <div className={`w-6 h-6 rounded-full border-4 transition-all duration-500 ${selectedRisk === risk ? "bg-white border-transparent scale-125" : "border-muted-foreground/30 group-hover:border-primary/50"}`} />
                         <span className={`text-2xl font-black uppercase tracking-[0.1em] ${selectedRisk === risk ? riskColors[risk].split(' ')[2] : "text-muted-foreground/60"}`}>
                           {risk} Risk
                         </span>
                      </div>
                      {selectedRisk === risk && (
                         <div className="animate-in fade-in zoom-in spin-in-12 duration-700">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                               <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
                            </div>
                         </div>
                      )}
                    </button>
                  ))}
               </div>
            </div>

            {/* Right: Reasoning & Justification */}
            <div className="xl:col-span-7 space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Clinical Justification</h3>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">Document the primary rationale for this variance from the AI assessment.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {overrideReasons.map((reason) => (
                    <label key={reason} className={`group flex items-start gap-4 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
                      selectedReason === reason 
                        ? "border-primary bg-primary/5 shadow-xl ring-1 ring-primary/20" 
                        : "border-border bg-secondary/5 hover:bg-secondary/10 hover:border-primary/20"
                    }`}>
                      <div className="relative flex items-center justify-center mt-1">
                         <input
                           type="radio"
                           name="reason"
                           checked={selectedReason === reason}
                           onChange={() => setSelectedReason(reason)}
                           className="peer opacity-0 absolute w-6 h-6 cursor-pointer"
                         />
                         <div className="w-6 h-6 rounded-lg border-2 border-muted-foreground/30 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform" />
                         </div>
                      </div>
                      <span className={`text-sm font-black leading-tight uppercase tracking-tight ${selectedReason === reason ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"}`}>
                        {reason}
                      </span>
                    </label>
                  ))}
               </div>

               {selectedReason === "Other clinical reason" && (
                 <div className="animate-in slide-in-from-top-6 duration-500 pt-4">
                    <textarea
                      placeholder="Provide exhaustive clinical professional justification for secondary review..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      rows={5}
                      className="w-full px-8 py-8 rounded-[2.5rem] border-2 border-primary/30 focus:border-primary bg-background text-foreground outline-none text-base font-medium resize-none shadow-2xl transition-all"
                    />
                 </div>
               )}
            </div>
          </div>

          <div className="pt-16 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-10">
            <button 
              onClick={() => navigate("/screening/results")}
              className="w-full md:w-auto px-12 py-6 rounded-2xl font-black text-muted-foreground hover:bg-secondary transition-all uppercase tracking-widest text-xs"
            >
              Discard modification
            </button>
            <button 
              onClick={handleSave} 
              className="w-full md:flex-1 max-w-2xl bg-primary text-primary-foreground h-24 rounded-[2.5rem] font-black tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-6 text-xl"
            >
              Verify & Apply Change
              <CheckCircle className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
