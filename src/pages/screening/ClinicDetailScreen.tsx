import { useNavigate, useParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
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
    <MobileLayout className="pb-6">
      <ScreenHeader title="Clinic Details" onBack={() => navigate(-1)} />

      <div className="px-4 pt-4 space-y-4 animate-fade-in">
        {/* Clinic Header */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground text-lg leading-tight">{clinic.name}</h2>
              <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {clinic.speciality}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(clinic.rating) ? "text-warning fill-warning" : "text-muted"}`} />
            ))}
            <span className="text-sm text-muted-foreground ml-1">{clinic.rating}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Contact Information</p>
          {[
            { icon: MapPin, label: "Address", value: clinic.address },
            { icon: Phone, label: "Phone", value: clinic.phone },
            { icon: Clock, label: "Hours", value: clinic.hours },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm text-foreground font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Services Available</p>
          <div className="flex flex-wrap gap-2">
            {clinic.services.map((service) => (
              <span key={service} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                {service}
              </span>
            ))}
          </div>
        </div>

        <ActionButton onClick={() => navigate(-1)}>
          Back to Referral
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
