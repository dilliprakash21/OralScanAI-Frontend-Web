import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
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
    <MobileLayout className="pb-6">
      <ScreenHeader title="Camp Mode" onBack={() => navigate("/dashboard")} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center relative">
            <Tent className="w-10 h-10 text-primary" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
              <Play className="w-2.5 h-2.5 text-success-foreground fill-current" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Oral Health Camp</h2>
            <p className="text-muted-foreground text-sm mt-1">Patient IDs will start with CS-</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Bulk screening", desc: "Screen multiple patients" },
            { icon: MapPin, label: "Location linked", desc: "Auto-tag all records" },
            { icon: Tent, label: "Camp mode data", desc: "Filter in statistics" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
          <p className="font-semibold text-foreground">Camp Setup</p>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Camp Name (Optional)</label>
            <input type="text" placeholder="e.g. Kamptee Village Camp" value={campName}
              onChange={(e) => setCampName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground outline-none text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Camp Location *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Village / Area name" value={campLocation}
                onChange={(e) => setCampLocation(e.target.value)}
                className="w-full h-12 pl-12 pr-14 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground outline-none text-sm" />
              <button type="button" onClick={handleGetLocation} disabled={fetchingLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                <Navigation className={`w-4 h-4 text-primary ${fetchingLocation ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{profile?.name || user?.email}</p>
              <p className="text-xs text-muted-foreground">Screening practitioner</p>
            </div>
          </div>
        </div>

        <ActionButton onClick={handleStartCamp} disabled={!campLocation.trim()}>
          <Tent className="w-5 h-5" /> Start Camp Screening
        </ActionButton>

        <button onClick={() => navigate("/statistics/camps")}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/40 transition-all">
          <span className="text-sm font-semibold text-foreground">View Previous Camp Summaries</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </MobileLayout>
  );
}
