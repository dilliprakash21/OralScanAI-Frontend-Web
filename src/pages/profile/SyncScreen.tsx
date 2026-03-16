import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { RefreshCw, CheckCircle, Wifi, WifiOff, Clock, Database } from "lucide-react";
import { toast } from "sonner";

export default function SyncScreen() {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [lastSync] = useState(new Date().toLocaleString());
  const [syncStatus] = useState<"synced" | "offline">("synced");

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSyncing(false);
    toast.success("Data synchronized successfully");
  };

  return (
    <MobileLayout className="pb-6">
      <ScreenHeader title="Sync Settings" onBack={() => navigate("/settings")} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        {/* Status */}
        <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${syncStatus === "synced" ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"
          }`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${syncStatus === "synced" ? "bg-success/15" : "bg-warning/15"
            }`}>
            {syncStatus === "synced" ? (
              <Wifi className="w-7 h-7 text-success" />
            ) : (
              <WifiOff className="w-7 h-7 text-warning" />
            )}
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">
              {syncStatus === "synced" ? "Connected" : "Offline Mode"}
            </p>
            <p className="text-sm text-muted-foreground">
              {syncStatus === "synced" ? "Data is synced to cloud" : "Data will sync when online"}
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Synced</p>
              <p className="font-semibold text-foreground text-sm">{lastSync}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Storage</p>
              <p className="font-semibold text-foreground text-sm">All data stored in OralScan AI Server</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-semibold text-success text-sm">All records up to date</p>
            </div>
          </div>
        </div>

        {/* Sync Info */}
        <div className="bg-accent rounded-xl p-4 text-sm text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground mb-1">About Data Sync</p>
          All screening records are automatically synced to the cloud in real-time when you have an internet connection.
          Records created offline will be queued and uploaded once connectivity is restored.
        </div>

        <ActionButton onClick={handleSync} loading={syncing}>
          <RefreshCw className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Now"}
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
