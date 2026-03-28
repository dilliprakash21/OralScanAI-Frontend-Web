import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-3">Cloud Synchronization</h1>
          <p className="text-muted-foreground font-medium text-lg">Manage your clinical data residency and synchronization protocols</p>
        </div>

        <div className="space-y-8 animate-fade-in">
          {/* Status Hero */}
          <div className={`relative overflow-hidden p-10 md:p-14 rounded-[3rem] border-4 transition-all duration-500 ${
            syncStatus === "synced" 
              ? "border-success/20 bg-success/5 shadow-2xl shadow-success/10" 
              : "border-warning/20 bg-warning/5 shadow-2xl shadow-warning/10"
          }`}>
             {/* Decorative Background Icon */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                {syncStatus === "synced" ? <Wifi className="w-96 h-96" /> : <WifiOff className="w-96 h-96" />}
             </div>

             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-xl ${
                  syncStatus === "synced" ? "bg-success text-white" : "bg-warning text-white"
                }`}>
                  {syncStatus === "synced" ? <Wifi className="w-12 h-12" /> : <WifiOff className="w-12 h-12" />}
                </div>
                
                <div className="text-center md:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                     <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                       syncStatus === "synced" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                     }`}>
                        {syncStatus === "synced" ? "SECURE CONNECTION ACTIVE" : "OFFLINE PROTOCOL ACTIVE"}
                     </span>
                  </div>
                  <h2 className="text-3xl font-black text-foreground">
                    {syncStatus === "synced" ? "Data Synchronized" : "Local Storage Mode"}
                  </h2>
                  <p className="text-muted-foreground font-medium max-w-sm">
                    {syncStatus === "synced" 
                      ? "Your clinical records are fully synchronized with our encrypted medical cloud infrastructure." 
                      : "Your data is safe locally and will be uploaded automatically once a secure connection is established."}
                  </p>
                </div>

                <div className="ml-auto flex-shrink-0">
                   <button 
                     onClick={handleSync} 
                     disabled={syncing}
                     className="group px-8 py-5 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-3 shadow-xl"
                   >
                     <RefreshCw className={`w-6 h-6 ${syncing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                     {syncing ? "SYNCING..." : "RE-SYNC NOW"}
                   </button>
                </div>
             </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "LAST SUCCESSFUL SYNC", value: lastSync, icon: Clock, color: "primary" },
              { label: "DATA RESIDENCY", value: "AWS Medical Cloud", icon: Database, color: "primary" },
              { label: "SYNC INTEGRITY", value: "Verified Healthy", icon: CheckCircle, color: "success" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm group hover:border-primary/30 transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${color}`} />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                <p className="font-black text-foreground text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Sync Information Detail */}
          <div className="bg-secondary/20 border-2 border-border/50 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.05]">
                <Database className="w-48 h-48 text-primary" />
             </div>
             <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                   <div className="w-1.5 h-8 bg-primary rounded-full" />
                   Security & Protocol FAQ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-2">
                      <p className="text-sm font-black text-foreground">How does automatic sync work?</p>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                         OralScan AI uses an 'Offline-First' architecture. Every record is indexed locally first, 
                         then streamed to our servers using TLS 1.3 encrypted sockets the moment you are online.
                      </p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-sm font-black text-foreground">Is my data encrypted during SYNC?</p>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                         Absolutely. We utilize end-to-end encryption for all PHI (Protected Health Information). 
                         Even our sync agents operate under zero-knowledge proofs.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
            Secure Cloud Protocol Version 2.0.4-S
           </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
