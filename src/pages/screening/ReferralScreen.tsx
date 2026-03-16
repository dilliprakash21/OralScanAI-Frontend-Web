import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { MapPin, ChevronRight, Search, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NearbyHospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  speciality: string;
}

const FALLBACK_CLINICS: NearbyHospital[] = [
  { id: "1", name: "Government District Hospital", address: "Civil Lines", distance: "—", speciality: "Oral Oncology" },
  { id: "2", name: "AIIMS Cancer Centre", address: "Medical Square", distance: "—", speciality: "Oncology" },
  { id: "3", name: "NMC Dental College", address: "Hingna Road", distance: "—", speciality: "Oral Surgery" },
  { id: "4", name: "City Dental Hospital", address: "Sitabuldi", distance: "—", speciality: "Periodontology" },
  { id: "5", name: "Primary Health Centre", address: "Kamptee", distance: "—", speciality: "General" },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ReferralScreen() {
  const navigate = useNavigate();
  const { updateData } = useScreening();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [clinics, setClinics] = useState<NearbyHospital[]>(FALLBACK_CLINICS);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const fetchNearbyHospitals = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Search for hospitals/clinics nearby using Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=hospital+dental+clinic&limit=10&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude - 0.1},${latitude + 0.1},${longitude + 0.1},${latitude - 0.1}`
          );
          const data = await response.json();
          if (data.length > 0) {
            const hospitals: NearbyHospital[] = data.map((item: any, idx: number) => {
              const dist = haversineDistance(latitude, longitude, parseFloat(item.lat), parseFloat(item.lon));
              return {
                id: String(idx + 1),
                name: item.display_name.split(",")[0],
                address: item.display_name.split(",").slice(1, 3).join(",").trim(),
                distance: `${dist.toFixed(1)} km`,
                speciality: "General",
              };
            }).sort((a: NearbyHospital, b: NearbyHospital) => parseFloat(a.distance) - parseFloat(b.distance));
            setClinics(hospitals);
            toast.success(`Found ${hospitals.length} nearby facilities`);
          } else {
            toast.info("No nearby hospitals found. Showing default list.");
          }
        } catch {
          toast.error("Could not fetch nearby hospitals");
        }
        setLoadingLocation(false);
      },
      () => {
        toast.error("Location access denied");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filtered = clinics.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleProceed = () => {
    const clinic = clinics.find((c) => c.id === selected);
    updateData({ referralClinic: clinic?.name || "" });
    navigate("/screening/save");
  };

  return (
    <MobileLayout className="pb-6">
      <ScreenHeader title="Referral" onBack={() => navigate("/screening/results")} />
      <ProgressSteps currentStep={7} totalSteps={8} />

      <div className="px-4 pt-4 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Select Referral Clinic</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose the most suitable facility</p>
          </div>
          <button
            onClick={fetchNearbyHospitals}
            disabled={loadingLocation}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 rounded-xl text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            {loadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            Nearby
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search clinics..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border focus:border-primary bg-card text-foreground outline-none" />
        </div>

        {/* Clinic List */}
        <div className="space-y-2 max-h-[45vh] overflow-auto">
          {filtered.map((clinic) => (
            <button key={clinic.id} onClick={() => setSelected(clinic.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                selected === clinic.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
              }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selected === clinic.id ? "bg-primary" : "bg-muted"}`}>
                <MapPin className={`w-5 h-5 ${selected === clinic.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{clinic.name}</p>
                <p className="text-xs text-muted-foreground truncate">{clinic.address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{clinic.speciality}</span>
                  <span className="text-xs text-muted-foreground">{clinic.distance}</span>
                </div>
              </div>
              {selected === clinic.id && <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <ActionButton onClick={handleProceed} disabled={!selected}>Confirm Referral & Save</ActionButton>
          <ActionButton variant="outline" onClick={() => navigate("/screening/save")}>Skip — Save Without Referral</ActionButton>
        </div>
      </div>
    </MobileLayout>
  );
}
