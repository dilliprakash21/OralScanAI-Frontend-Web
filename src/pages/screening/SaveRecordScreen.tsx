import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
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
    <MobileLayout>
      <ScreenHeader title="Save Record" onBack={() => navigate(-1)} />

      <div className="p-4 space-y-6">
        <ProgressSteps currentStep={7} totalSteps={7} />

        <div className="bg-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Notes (optional)</h3>
          </div>
          <textarea
            className="w-full min-h-[120px] rounded-lg border bg-background p-3 text-sm"
            placeholder="Add clinical notes or observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {!savedId ? (
          <ActionButton onClick={handleSave} fullWidth disabled={saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save Record"
            )}
          </ActionButton>
        ) : (
          <div className="bg-card rounded-xl p-6 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-success mx-auto" />
            <p className="font-semibold">Saved successfully</p>
            <p className="text-sm text-muted-foreground">Record ID: {savedId}</p>
            <ActionButton onClick={() => navigate(`/records/${savedId}`)} fullWidth variant="secondary">
              View Record
            </ActionButton>
            <ActionButton onClick={handleFinish} fullWidth>
              Finish
            </ActionButton>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
