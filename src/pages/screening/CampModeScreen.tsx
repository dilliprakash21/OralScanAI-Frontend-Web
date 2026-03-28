import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Label } from "@/components/ui/label";
import { useScreening } from "@/contexts/ScreeningContext";
import { useAuth } from "@/contexts/AuthContext";
import { Tent, Users, MapPin, Play, ChevronRight, Navigation } from "lucide-react";
import { toast } from "sonner";

export default function CampModeScreen() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { updateData, resetData } = useScreening();
  const [campLocation, setCampLocation] = useState("");
  const [campName, setCampName] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const loc = data.address?.village || data.address?.town || data.address?.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setCampLocation(loc);
          toast.success(`Location: ${loc}`);
        } catch {
          setCampLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setFetchingLocation(false);
      },
      () => { toast.error("Could not get location"); setFetchingLocation(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleStartCamp = () => {
    if (!campLocation.trim()) { toast.error("Please enter the camp location"); return; }
    resetData();
    updateData({ mode: "camp", location: campLocation.trim() });
    toast.success(`Camp started at ${campLocation}`);
    navigate("/screening/consent");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Clinical Field Camp</h1>
            <p className="text-muted-foreground font-medium text-lg">Initialize a high-throughput screening session for rural or community outreach.</p>
          </div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 rounded-2xl bg-secondary/50 font-black text-muted-foreground hover:bg-secondary transition-all"
          >
            RETURN TO DASHBOARD
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          {/* Left: Camp configuration */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card border border-border/50 rounded-[3rem] p-8 md:p-12 shadow-sm space-y-10">
               <div className="space-y-8">
                  <div className="space-y-4">
                     <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Event Identification</Label>
                     <div className="relative group">
                        <Tent className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="e.g. Annual Community Health Drive 2026" 
                          value={campName}
                          onChange={(e) => setCampName(e.target.value)}
                          className="w-full h-16 pl-16 pr-6 rounded-2xl border-2 border-border/80 focus:border-primary bg-secondary/5 text-lg font-bold transition-all outline-none" 
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">Geographic Deployment *</Label>
                     <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Village / Area / GPS Location" 
                          value={campLocation}
                          onChange={(e) => setCampLocation(e.target.value)}
                          className="w-full h-16 pl-16 pr-20 rounded-2xl border-2 border-border/80 focus:border-primary bg-secondary/5 text-lg font-bold transition-all outline-none" 
                        />
                        <button 
                          type="button" 
                          onClick={handleGetLocation} 
                          disabled={fetchingLocation}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                          title="Fetch GPS Coordinates"
                        >
                           <Navigation className={`w-5 h-5 ${fetchingLocation ? "animate-spin" : ""}`} />
                        </button>
                     </div>
                     <p className="text-[10px] text-muted-foreground/60 font-medium ml-1">
                        * Required field. Used to aggregate epidemiological data in the clinical heatmap.
                     </p>
                  </div>
               </div>

               <div className="pt-8 border-t border-border/50">
                  <button 
                    onClick={handleStartCamp} 
                    disabled={!campLocation.trim()}
                    className="w-full py-6 rounded-[2rem] bg-primary text-primary-foreground font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    INITIALIZE CAMP SESSION
                  </button>
               </div>
            </div>

            <button 
              onClick={() => navigate("/statistics/camps")}
              className="w-full flex items-center justify-between p-8 bg-secondary/20 rounded-[2rem] border-2 border-border/50 hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <Tent className="w-7 h-7 text-primary" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-foreground">View Historical Camp Analytics</p>
                    <p className="text-xs text-muted-foreground font-medium">Access protocols and results from previous deployments</p>
                 </div>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Right: Mode breakdown */}
          <div className="lg:col-span-5 space-y-8">
             <div className="bg-foreground text-background rounded-[3rem] p-10 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <Users className="w-64 h-64" />
                </div>
                
                <h3 className="text-2xl font-black leading-tight relative z-10">High-Throughput <br/>Protocol Features</h3>
                
                <div className="space-y-6 relative z-10">
                   {[
                     { icon: Users, title: "Streamlined IDs", desc: "Automated sequence numbering (CS-XXXX) for rapid patient intake." },
                     { icon: MapPin, title: "Geospatial Tagging", desc: "Every record is automatically linked to the camp coordinates." },
                     { icon: Tent, title: "Clustered Analytics", desc: "Advanced filtering in the statistics module for camp-specific insight." },
                   ].map(({ icon: Icon, title, desc }) => (
                     <div key={title} className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                           <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-black text-white">{title}</p>
                           <p className="text-xs text-white/60 font-medium leading-relaxed">{desc}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 rounded-full border-2 border-white/20 p-1">
                      <div className="w-full h-full rounded-full bg-success animate-pulse" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operator Active</p>
                      <p className="text-sm font-black text-white">{profile?.name || "Verified Practitioner"}</p>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-info/5 border-2 border-info/10 rounded-[2.5rem] space-y-4">
                <h4 className="text-xs font-black text-info uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-4 bg-info rounded-full" />
                   Field Deployment Notice
                </h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   Ensure stable network connectivity before starting. In areas of poor signal, 
                   Offline-First sync will queue records until a backhaul is detected.
                </p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
