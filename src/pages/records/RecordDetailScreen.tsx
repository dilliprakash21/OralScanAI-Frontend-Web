import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function RecordDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [record, setRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api.screenings.get(id);
        setRecord(res.screening);
      } catch (err: any) {
        toast({ title: "Failed to load record", description: err?.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, toast]);

  return (
    <MobileLayout>
      <ScreenHeader title="Record Detail" onBack={() => navigate("/records")} />

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : !record ? (
          <div className="bg-card rounded-xl p-6 text-center">
            <p className="text-muted-foreground">Record not found</p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{record.patient_name || "Patient"}</p>
                <p className="text-sm text-muted-foreground">ID: {record.patient_id}</p>
              </div>
              <RiskBadge risk={record.risk_level || "low"} />
            </div>

            <div className="bg-card rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span>{record.age ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gender</span><span>{record.gender ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{record.phone ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{record.location ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span>{record.mode ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Plaque Index</span><span>{record.plaque_index ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gingival Index</span><span>{record.gingival_index ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">AI Confidence</span><span>{record.ai_confidence ?? "-"}</span></div>
              {record.notes && (
                <div className="pt-2 border-t">
                  <p className="text-muted-foreground">Notes</p>
                  <p>{record.notes}</p>
                </div>
              )}
            </div>

            {(record.image_url || record.heatmap_url) && (
              <div className="grid grid-cols-2 gap-3">
                {record.image_url && (
                  <div className="bg-card rounded-xl p-2">
                    <p className="text-xs text-muted-foreground mb-1">Image</p>
                    <img src={record.image_url} className="w-full rounded-lg" alt="image" />
                  </div>
                )}
                {record.heatmap_url && (
                  <div className="bg-card rounded-xl p-2">
                    <p className="text-xs text-muted-foreground mb-1">Heatmap</p>
                    <img src={record.heatmap_url} className="w-full rounded-lg" alt="heatmap" />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
}
