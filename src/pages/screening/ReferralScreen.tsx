import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { MapPin, ChevronRight, Search, Navigation } from "lucide-react";
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

export default function ReferralScreen() {
  const navigate = useNavigate();
  const { updateData } = useScreening();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [clinics, setClinics] = useState<NearbyHospital[]>(FALLBACK_CLINICS);

  const filtered = clinics.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleProceed = () => {
    const clinic = clinics.find((c) => c.id === selected);
    updateData({ referralClinic: clinic?.name || "" });
    navigate("/screening/save");
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto py-12 px-6">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Tertiary referral network</h1>
            <p className="text-muted-foreground font-medium text-lg">Locating specialized oncology and maxillofacial centers for advanced diagnostic correlation.</p>
          </div>
          <div className="w-full xl:max-w-md">
            <ProgressSteps currentStep={7} totalSteps={8} />
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[4rem] p-10 md:p-16 shadow-2xl space-y-12 animate-fade-in relative overflow-hidden">
          {/* Subtle background flair */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96" />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 relative z-10">
            {/* Left: Global Search & Precision Controls */}
            <div className="xl:col-span-4 space-y-10">
               <div className="space-y-8">
                   <div className="flex items-center justify-between gap-6">
                    <div className="space-y-1">
                       <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Facility Locator</h2>
                       <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Global Provider Database</p>
                    </div>
                  </div>

                  <div className="relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground/40 group-focus-within:text-primary transition-all duration-500" />
                    <input 
                      type="text" 
                      placeholder="Search by center, zone, or speciality..." 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-20 pl-20 pr-8 rounded-[2rem] border-2 border-border focus:border-primary bg-secondary/10 text-foreground outline-none font-bold text-lg transition-all shadow-inner group-focus-within:bg-background" 
                    />
                  </div>
               </div>

               <div className="bg-info/5 border-2 border-info/10 rounded-[2.5rem] p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-info/10 rounded-xl">
                       <MapPin className="w-6 h-6 text-info" />
                    </div>
                    <p className="text-xs font-black text-info uppercase tracking-[0.2em]">Geospatial Calibration</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">
                    Routing algorithms utilize WGS84 ellipsoidal distance patterns. 
                    Real-world travel time may vary based on traffic and infrastructure conditions.
                  </p>
               </div>
            </div>

            {/* Right: Facility Grid */}
            <div className="xl:col-span-8 space-y-8">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Identified Centers ({filtered.length})</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Verified</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {filtered.map((clinic) => (
                  <button 
                    key={clinic.id} 
                    onClick={() => setSelected(clinic.id)}
                    className={`w-full group relative flex items-start gap-8 p-8 rounded-[3rem] border-2 text-left transition-all duration-500 ${
                      selected === clinic.id 
                        ? "border-primary bg-primary/5 shadow-2xl scale-[0.98] ring-1 ring-primary/20" 
                        : "border-border bg-secondary/10 hover:bg-secondary/20 hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 transition-all duration-500 ${selected === clinic.id ? "bg-primary shadow-2xl shadow-primary/40 rotate-12" : "bg-background border border-border"}`}>
                      <MapPin className={`w-10 h-10 ${selected === clinic.id ? "text-primary-foreground" : "text-muted-foreground/40"}`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                       <div className="flex items-center justify-between gap-4">
                          <p className={`font-black uppercase tracking-tight text-xl truncate transition-colors ${selected === clinic.id ? "text-primary" : "text-foreground"}`}>{clinic.name}</p>
                          {selected === clinic.id && <div className="w-3 h-3 rounded-full bg-primary animate-ping" />}
                       </div>
                       <p className="text-sm text-muted-foreground font-bold truncate opacity-80">{clinic.address}</p>
                       <div className="flex items-center gap-4 pt-3">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20">
                           {clinic.speciality}
                        </span>
                        <span className="text-xs font-black text-muted-foreground flex items-center gap-2 italic">
                           <Navigation className="w-4 h-4" /> {clinic.distance}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                   <div className="col-span-full text-center py-32 bg-secondary/5 rounded-[4rem] border-4 border-dashed border-border/50 space-y-6">
                      <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                         <Search className="w-12 h-12 text-muted-foreground/20" />
                      </div>
                      <p className="text-muted-foreground font-black text-xl uppercase tracking-tighter">Diagnostic network empty</p>
                      <button onClick={() => setSearch("")} className="text-primary font-black uppercase tracking-widest text-xs border-b border-primary/40 pb-1">Reset Filters</button>
                   </div>
                )}
               </div>
            </div>
          </div>

          <div className="pt-16 border-t border-border/50 flex flex-col xl:flex-row items-center justify-between gap-10 relative z-10">
            <button 
              onClick={() => navigate("/screening/results")}
              className="w-full xl:w-auto px-12 py-6 rounded-2xl font-black text-muted-foreground hover:bg-secondary transition-all uppercase tracking-widest text-xs"
            >
              Back to Scorecard
            </button>
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl">
              <button 
                onClick={() => navigate("/screening/save")}
                className="flex-1 h-24 rounded-[2.5rem] border-2 border-border font-black text-foreground uppercase tracking-widest hover:bg-secondary transition-all text-sm"
              >
                Skip protocol
              </button>
              <button 
                onClick={handleProceed} 
                className="flex-[2] h-24 rounded-[2.5rem] font-black tracking-[0.3em] uppercase transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-6 text-xl bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
              >
                {selected ? "Sync Referral & Commit" : "Commit Clinical Record"}
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
