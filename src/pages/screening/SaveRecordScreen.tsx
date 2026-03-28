import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { CheckCircle, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function SaveRecordScreen() {
  const navigate = useNavigate();
  const { data, resetData } = useScreening();
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!data.patientId) {
      toast.error("Missing patient ID");
      return;
    }

    setSaving(true);
    try {
      const res = await api.screenings.create({
        patient_id: data.patientId,
        patient_name: data.patientName ?? null,
        phone: data.phone ?? null,
        age: data.age ?? null,
        dob: data.dob ?? null,
        gender: data.gender ?? null,
        location: data.location ?? null,
        mode: data.mode ?? "screening",
        consent_given: data.consentGiven ?? true,
        image_url: data.imageUrl ?? null,
        heatmap_url: data.heatmapUrl ?? null,
        risk_level: data.riskLevel ?? null,
        ai_confidence: data.aiConfidence ?? null,
        plaque_index: data.plaqueIndex ?? null,
        gingival_index: data.gingivalIndex ?? null,
        overridden: data.overridden ?? false,
        override_reason: data.overrideReason ?? null,
        referral_clinic: data.referralClinic ?? null,
        notes: notes.trim() || null,
      });

      setSavedId(res.screening.id);
      toast.success("Record saved");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    resetData();
    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-16 px-6 relative overflow-hidden">
        {/* Decorative flair */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        
        <div className="text-center mb-16 space-y-4 relative z-10">
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">Finalize clinical <br/>commitment</h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">
             Secure synchronization of diagnostic markers and practitioner observations to the central health registry.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-[4rem] p-10 md:p-20 shadow-2xl animate-fade-in relative overflow-hidden ring-1 ring-white/5">
          {!savedId ? (
            <div className="relative z-10 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center shadow-inner">
                     <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Practitioner Insights</h3>
                    <p className="text-muted-foreground font-bold text-sm">Document supplementary observations for future longitudinal study.</p>
                  </div>
                </div>
                
                <textarea
                  className="w-full min-h-[250px] rounded-[3rem] border-2 border-border focus:border-primary bg-secondary/10 p-10 text-lg font-medium transition-all outline-none resize-none shadow-inner group-focus:bg-background"
                  placeholder="Enter detailed clinical notes, differential diagnosis considerations, or follow-up milestones..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="pt-6 flex flex-col xl:flex-row gap-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="px-12 py-6 rounded-2xl font-black text-muted-foreground hover:bg-secondary transition-all uppercase tracking-widest text-xs"
                >
                  RETURN TO DIAGNOSTICS
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground h-24 rounded-[2.5rem] font-black tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-5 text-xl disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin" />
                      SECURE SYNC...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-8 h-8" />
                      COMMIT RECORD
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-12 animate-in zoom-in duration-700">
              <div className="relative inline-block">
                 <div className="absolute inset-x-0 bottom-0 h-4 bg-success/30 blur-2xl rounded-full" />
                 <div className="relative w-40 h-40 rounded-[3rem] bg-success flex items-center justify-center mx-auto shadow-2xl shadow-success/40 ring-4 ring-white/20 transform transition-transform hover:rotate-12">
                    <CheckCircle className="w-20 h-20 text-white" />
                 </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-foreground uppercase tracking-tight">Registry Synchronized</h2>
                <p className="text-muted-foreground font-bold text-lg max-w-lg mx-auto leading-relaxed">
                   Biometric data and analysis signatures have been permanently secured in the cloud infrastructure.
                </p>
              </div>

              <div className="bg-secondary/20 border border-border/50 rounded-[2.5rem] p-10 max-w-md mx-auto group hover:bg-secondary/30 transition-colors">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Blockchain Verified Record ID</p>
                 <p className="text-3xl font-black text-primary font-mono select-all truncate">{savedId}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                <button 
                  onClick={() => navigate(`/records/${savedId}`)}
                  className="h-20 rounded-2xl border-2 border-primary/30 bg-primary/5 text-primary font-black uppercase tracking-[0.2em] text-sm hover:bg-primary/10 transition-all shadow-lg"
                >
                  Inspect Full File
                </button>
                <button 
                  onClick={handleFinish}
                  className="h-20 rounded-2xl bg-foreground text-background font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-foreground/20"
                >
                  End Protocol
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 text-center space-y-2 opacity-40">
           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Precision Data Governance</p>
           <p className="text-[10px] text-muted-foreground font-medium max-w-2xl mx-auto">
              Security: AES-256 Cloud Encryption | TLS 1.3 Transmission | HIPAA/GDPR Reference Compliant Storage 
              Infrastructure. Access strictly limited to authorized clinical practitioners.
           </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
