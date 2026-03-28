import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { useScreening } from "@/contexts/ScreeningContext";
import { User, Phone, MapPin, Calendar, Navigation } from "lucide-react";
import { toast } from "sonner";

function validateIndianPhone(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return "Must be exactly 10 digits";
  if (!/^[6-9]/.test(digits)) return "Enter a valid Indian mobile number";
  return null;
}

function validateAge(age: string): string | null {
  if (!age) return null;
  const num = parseInt(age);
  if (isNaN(num) || num < 0) return "Age cannot be negative";
  if (num < 4) return "Patient must be at least 4 years old";
  if (num > 120) return "Please enter a valid age";
  return null;
}

export default function PatientDetailsScreen() {
  const navigate = useNavigate();
  const { data: screeningData, updateData } = useScreening();

  // Check consent
  useEffect(() => {
    if (!screeningData.consentGiven) {
      toast.error("Consent is required before proceeding");
      navigate("/screening/consent");
    }
  }, []);

  const [patientName, setPatientName] = useState(screeningData.patientName || "");
  const [age, setAge] = useState(screeningData.age ? String(screeningData.age) : "");
  const [ageError, setAgeError] = useState<string | null>(null);
  const [dob, setDob] = useState(screeningData.dob || "");
  const [gender, setGender] = useState(screeningData.gender || "");
  const [phone, setPhone] = useState(screeningData.phone ? screeningData.phone.replace("+91", "") : "");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [location, setLocation] = useState(screeningData.location || "");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleNameChange = (val: string) => {
    // Only letters, spaces, dots, apostrophes, hyphens
    const filtered = val.replace(/[^A-Za-z\s.'-]/g, "");
    setPatientName(filtered);
  };

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    setPhoneError(digits.length > 0 && digits.length < 10 ? "Must be 10 digits" : (digits.length === 10 ? validateIndianPhone(digits) : null));
  };

  const handleAgeChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 3);
    setAge(digits);
    setAgeError(digits ? validateAge(digits) : null);
  };

  const handleDobChange = (val: string) => {
    setDob(val);
    if (val) {
      const birthDate = new Date(val);
      const today = new Date();
      if (birthDate > today) {
        toast.error("Date of birth cannot be in the future");
        setDob("");
        return;
      }
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge < 4) {
        toast.error("Patient must be at least 4 years old");
        setDob("");
        return;
      }
      setAge(String(calculatedAge));
      setAgeError(null);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName = data.address?.village || data.address?.town || data.address?.city || data.address?.county || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(locationName);
          toast.success(`Location: ${locationName}`);
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setFetchingLocation(false);
      },
      (error) => {
        toast.error("Could not get location. Please enter manually.");
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleProceed = () => {
    if (!patientName.trim()) { toast.error("Patient name is required"); return; }
    if (validateAge(age)) { toast.error(validateAge(age)!); return; }
    if (!gender) { toast.error("Please select gender"); return; }
    if (phone && phoneError) { toast.error(phoneError); return; }

    // Generate patient ID: NS- for screening, CS- for camp
    const prefix = screeningData.mode === "camp" ? "CS" : "NS";
    const patientId = `${prefix}-${Date.now().toString().slice(-6)}`;

    updateData({
      patientName: patientName.trim(),
      patientId,
      age: age ? parseInt(age) : undefined,
      dob: dob || undefined,
      gender,
      phone: phone ? `+91${phone}` : undefined,
      location: location.trim() || undefined,
    });
    navigate("/screening/dye-instruction");
  };

  const isValid = patientName.trim() && gender && !phoneError && !ageError;

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 4);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Patient Intake</h1>
            <p className="text-muted-foreground font-medium text-lg">Initialize clinical record with valid demographic and contact parameters.</p>
          </div>
          <div className="w-full md:max-w-xs">
            <ProgressSteps currentStep={2} totalSteps={7} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          {/* Left: Primary Form Data */}
          <div className="lg:col-span-8">
            <div className="bg-card border border-border/50 rounded-[3rem] p-8 md:p-12 shadow-sm space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Legal Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      value={patientName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full h-16 pl-16 pr-6 rounded-2xl border-2 border-border/60 focus:border-primary bg-secondary/10 focus:bg-background text-lg font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Gender Identity *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g.toLowerCase())}
                        className={`h-16 rounded-2xl border-2 font-black uppercase text-xs tracking-widest transition-all ${gender === g.toLowerCase()
                            ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]"
                            : "border-border/40 bg-secondary/5 text-foreground hover:border-primary/40"
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Assigned DOB</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => handleDobChange(e.target.value)}
                      max={maxDate.toISOString().split("T")[0]}
                      className="w-full h-16 pl-16 pr-6 rounded-2xl border-2 border-border/60 focus:border-primary bg-secondary/10 focus:bg-background text-lg font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Clinical Age Range *</label>
                  <div className="relative group">
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">YEARS</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Min 4"
                      value={age}
                      onChange={(e) => handleAgeChange(e.target.value)}
                      className={`w-full h-16 px-6 pr-16 rounded-2xl border-2 ${ageError ? "border-destructive" : "border-border/60 focus:border-primary"} bg-secondary/10 focus:bg-background text-lg font-bold transition-all outline-none`}
                    />
                  </div>
                  {ageError && <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-1 ml-1">{ageError}</p>}
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Contact Communication</label>
                  <div className="flex group">
                    <div className="flex items-center px-6 h-16 bg-foreground text-background border-2 border-r-0 border-foreground rounded-l-2xl text-lg font-black">
                      +91
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Primary mobile for results sync"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        maxLength={10}
                        className={`w-full h-16 pl-16 pr-6 rounded-r-2xl border-2 ${phoneError ? "border-destructive" : "border-border/60 focus:border-primary"} bg-secondary/10 focus:bg-background text-lg font-bold transition-all outline-none`}
                      />
                    </div>
                  </div>
                  {phoneError && <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-1 ml-2">{phoneError}</p>}
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Geographic Origin</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Search village or fetch GPS coordinates"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-16 pl-16 pr-20 rounded-2xl border-2 border-border/60 focus:border-primary bg-secondary/10 focus:bg-background text-lg font-bold transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={fetchingLocation}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                      <Navigation className={`w-5 h-5 ${fetchingLocation ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                 <button 
                  onClick={() => navigate("/screening/consent")}
                  className="w-full md:w-auto px-10 py-5 rounded-2xl font-black text-muted-foreground hover:bg-secondary transition-all uppercase tracking-widest text-xs"
                >
                  BACK TO CONSENT
                </button>
                <button 
                  onClick={handleProceed} 
                  disabled={!isValid}
                  className={`w-full md:flex-1 max-w-lg py-6 rounded-[2rem] font-black tracking-[0.3em] uppercase transition-all shadow-2xl shadow-primary/30 ${
                    isValid 
                      ? "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]" 
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  }`}
                >
                  CONTINUE TO PREPARATION
                </button>
              </div>
            </div>
          </div>

          {/* Right: Validation & Summary info */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-foreground text-background rounded-[3.5rem] p-10 md:p-12 shadow-2xl space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                   <User className="w-64 h-64" />
                </div>
                
                <h3 className="text-2xl font-black leading-tight relative z-10">Data Integrity <br/>Verification</h3>
                
                <div className="space-y-8 relative z-10">
                   <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${patientName.trim() ? "bg-success/20 text-success" : "bg-white/10 text-white/40"}`}>
                         <User className="w-7 h-7" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Identification</p>
                         <p className="text-sm font-black">{patientName.trim() || "Awaiting Input"}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${gender ? "bg-success/20 text-success" : "bg-white/10 text-white/40"}`}>
                         <Calendar className="w-7 h-7" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Demographics</p>
                         <p className="text-sm font-black">{age ? `${age}yr • ${gender || "N/A"}` : "Awaiting Input"}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${phone && !phoneError ? "bg-success/20 text-success" : "bg-white/10 text-white/40"}`}>
                         <Phone className="w-7 h-7" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Sync Gateway</p>
                         <p className="text-sm font-black">{phone ? `+91 ${phone}` : "Awaiting Input"}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/10 relative z-10">
                   <p className="text-xs text-white/40 font-medium italic leading-relaxed">
                      "Clinical cohort analysis relies on accurate demographic clustering. Ensure patient ID documents 
                      are verified where available."
                   </p>
                </div>
             </div>

             <div className="p-10 bg-info/5 border-2 border-info/10 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-info rounded-full" />
                   <h4 className="text-xs font-black text-info uppercase tracking-widest">Protocol Notice</h4>
                </div>
                <div className="space-y-4">
                   <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      All entered data is transmitted over TLS 1.3 and stored in alignment with 
                      local digital healthcare data regulations.
                   </p>
                   <div className="flex items-center gap-2 px-4 py-2 bg-info/10 text-info rounded-xl w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure Endpoint Active</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
