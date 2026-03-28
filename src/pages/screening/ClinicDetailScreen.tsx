import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapPin, Phone, Clock, Star } from "lucide-react";

const CLINIC_DATA: Record<string, {
  name: string; address: string; phone: string; hours: string; speciality: string; rating: number; services: string[];
}> = {
  "1": { name: "Government District Hospital", address: "Civil Lines, Nagpur, Maharashtra 440001", phone: "+91 712 2555 555", hours: "Mon–Sat: 8am–8pm", speciality: "Oral Oncology", rating: 4.2, services: ["Biopsy", "Oral Pathology", "Cancer Screening", "Chemotherapy"] },
  "2": { name: "AIIMS Cancer Centre", address: "Medical Square, Nagpur, Maharashtra 440003", phone: "+91 712 3555 000", hours: "Mon–Fri: 9am–5pm", speciality: "Oncology", rating: 4.8, services: ["Oncology", "Radiation", "Surgery", "Palliative Care"] },
  "3": { name: "NMC Dental College", address: "Hingna Road, Nagpur, Maharashtra 440016", phone: "+91 712 2220 100", hours: "Mon–Sat: 9am–5pm", speciality: "Oral Surgery", rating: 4.0, services: ["Oral Surgery", "Prosthodontics", "Orthodontics", "Implants"] },
};

export default function ClinicDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const clinic = CLINIC_DATA[id || "1"] || CLINIC_DATA["1"];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">Facility Profile</h1>
            <p className="text-muted-foreground font-medium">Detailed clinical and operational information for {clinic.name}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-2xl bg-secondary/50 font-black text-muted-foreground hover:bg-secondary transition-all flex items-center gap-2"
          >
            BACK TO REFERRAL
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          {/* Left: Main Info */}
          <div className="lg:col-span-8 space-y-12">
            {/* Hero Card */}
            <div className="bg-card border border-border/50 rounded-[3rem] p-10 md:p-14 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <MapPin className="w-48 h-48 text-primary" />
               </div>
               <div className="relative z-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                     <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center shrink-0 border-4 border-white shadow-xl">
                        <MapPin className="w-12 h-12 text-primary" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                              {clinic.speciality}
                           </span>
                           <div className="flex items-center gap-1.5 bg-warning/10 px-3 py-1.5 rounded-full">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(clinic.rating) ? "text-warning fill-warning" : "text-muted"}`} />
                              ))}
                              <span className="text-xs font-black text-warning ml-1">{clinic.rating}</span>
                           </div>
                        </div>
                        <h2 className="text-4xl font-black text-foreground leading-tight">{clinic.name}</h2>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                       { icon: MapPin, label: "CLINICAL ADDRESS", value: clinic.address },
                       { icon: Clock, label: "OPD HOURS", value: clinic.hours },
                     ].map(({ icon: Icon, label, value }) => (
                       <div key={label} className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
                          <div className="flex gap-3">
                             <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-primary" />
                             </div>
                             <p className="text-sm font-bold text-foreground leading-relaxed">{value}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-6 px-4">
               <h3 className="text-2xl font-black text-foreground uppercase tracking-widest flex items-center gap-4">
                  <div className="w-2 h-8 bg-primary rounded-full transition-all" />
                  Clinical Services Available
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {clinic.services.map((service) => (
                   <div key={service} className="bg-secondary/10 border border-border/50 rounded-2xl p-4 text-center hover:bg-primary/5 hover:border-primary/30 transition-all cursor-default group">
                     <p className="text-xs font-black text-muted-foreground group-hover:text-primary transition-colors">{service}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                <div className="space-y-4">
                   <h4 className="text-xl font-black text-foreground">Contact Facility</h4>
                   <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      Liaise with the facility administration directly for appointment scheduling 
                      or clinical handoff protocols.
                   </p>
                </div>

                <div className="space-y-4">
                   <div className="p-6 bg-secondary/20 rounded-3xl border border-border/50 flex flex-col items-center gap-2 text-center">
                      <Phone className="w-8 h-8 text-primary mb-2" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">DIAL DIRECT</p>
                      <p className="text-xl font-black text-foreground">{clinic.phone}</p>
                   </div>
                   
                   <button className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                      SCHEDULE VISIT
                   </button>
                   <button className="w-full py-5 rounded-2xl border-2 border-border font-black text-foreground hover:bg-secondary transition-all">
                      NAVIGATE TO CLINIC
                   </button>
                </div>
             </div>

             <div className="p-8 bg-info/5 border-2 border-info/10 rounded-[2rem] space-y-4">
                <h5 className="font-black text-foreground flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-info" />
                   Clinic Note
                </h5>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   This facility is part of the approved OralScan AI Referral Network. 
                   Data shared with this facility is synchronized via secure HL7/FHIR protocols.
                </p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
