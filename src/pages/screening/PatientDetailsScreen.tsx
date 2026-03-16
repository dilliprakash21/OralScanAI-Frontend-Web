import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
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

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState<string | null>(null);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [location, setLocation] = useState("");
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
    <MobileLayout className="pb-6">
      <ScreenHeader title="Patient Details" onBack={() => navigate("/screening/consent")} />
      <ProgressSteps currentStep={2} totalSteps={8} />

      <div className="px-4 pt-4 space-y-4 animate-fade-in">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Full Name *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Patient's full name (letters only)"
              value={patientName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-border focus:border-primary bg-card text-foreground outline-none text-base"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Gender *</label>
          <div className="grid grid-cols-3 gap-2">
            {["Male", "Female", "Other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g.toLowerCase())}
                className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${gender === g.toLowerCase()
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* DOB + Age */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={dob}
                onChange={(e) => handleDobChange(e.target.value)}
                max={maxDate.toISOString().split("T")[0]}
                className="w-full h-14 pl-10 pr-2 rounded-xl border-2 border-border focus:border-primary bg-card text-foreground outline-none text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Age (years)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Age (min 4)"
              value={age}
              onChange={(e) => handleAgeChange(e.target.value)}
              className={`w-full h-14 px-4 rounded-xl border-2 ${ageError ? "border-destructive" : "border-border focus:border-primary"} bg-card text-foreground outline-none text-base`}
            />
            {ageError && <p className="text-xs text-destructive">{ageError}</p>}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Mobile Number</label>
          <div className="flex">
            <div className="flex items-center px-3 h-14 bg-muted border-2 border-r-0 border-border rounded-l-xl text-sm font-semibold text-foreground">
              +91
            </div>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={10}
                className={`w-full h-14 pl-10 pr-4 rounded-r-xl border-2 ${phoneError ? "border-destructive" : "border-border focus:border-primary"} bg-card text-foreground outline-none text-base`}
              />
            </div>
          </div>
          {phoneError && <p className="text-xs text-destructive ml-1">{phoneError}</p>}
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Location / Village</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Location or village name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-14 pl-12 pr-14 rounded-xl border-2 border-border focus:border-primary bg-card text-foreground outline-none text-base"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={fetchingLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              title="Get current location"
            >
              <Navigation className={`w-4 h-4 text-primary ${fetchingLocation ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <ActionButton onClick={handleProceed} disabled={!isValid}>
          Continue
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
