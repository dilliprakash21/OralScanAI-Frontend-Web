import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Eye, EyeOff, Mail, Lock, User, Stethoscope, Phone, Building2, MapPin, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useScreening } from "@/contexts/ScreeningContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function SignupScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const { data } = useScreening(); // role selected earlier

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clinic, setClinic] = useState("");
  const [location, setLocation] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rawRole, setRawRole] = useState(localStorage.getItem("userRole") || "health-worker");
  const role = rawRole === "health-worker" ? "health_worker" : rawRole;

  const handleRoleToggle = (newRole: string) => {
    setRawRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast({ title: "Validation Error", description: "Mobile number must be 10 digits.", variant: "destructive" });
      return;
    }
    if (!/^[6-9]/.test(digits)) {
      toast({ title: "Validation Error", description: "Invalid mobile prefix.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await api.auth.signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        clinic: clinic.trim() || null,
        location: location.trim() || null,
        role,
        license_no: role === "dentist" ? (licenseNo.trim() || null) : null,
        password,
      });

      toast({ title: "Registration code sent", description: "Verify your identity via the code sent to your email." });
      navigate(`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}&mode=signup`);
    } catch (err: any) {
      toast({
        title: "Registry Failed",
        description: err?.message || "Could not complete registration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle={`Verifying your registration for ${role.replace("_", " ")}`}
    >
      <div className="mb-8 p-1.5 bg-secondary/10 rounded-2xl flex gap-2">
        <button
          onClick={() => handleRoleToggle("dentist")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            rawRole === "dentist" 
              ? "bg-card text-primary shadow-lg ring-1 ring-primary/20" 
              : "text-muted-foreground hover:bg-secondary/20"
          }`}
        >
          Clinical Dentist
        </button>
        <button
          onClick={() => handleRoleToggle("health-worker")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            rawRole === "health-worker" 
              ? "bg-card text-success shadow-lg ring-1 ring-success/20" 
              : "text-muted-foreground hover:bg-secondary/20"
          }`}
        >
          Health Worker
        </button>
      </div>

      <form onSubmit={handleSignup} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="name" className="pl-9 h-14 bg-secondary/5 border-2 border-border/50 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Dr. John Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="email" type="email" className="pl-9 h-14 bg-secondary/5 border-2 border-border/50 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@email.com" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</Label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">+91</span>
              <Input
                id="phone"
                type="tel"
                className="pl-12 h-14 bg-secondary/5 border-2 border-border/50 rounded-xl"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="0000000000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinic" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Clinic Name</Label>
              <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="clinic" className="pl-9 h-14 bg-secondary/5 border-2 border-border/50 rounded-xl" value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Hospital Name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location / City</Label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="location" className="pl-9 h-14 bg-secondary/5 border-2 border-border/50 rounded-xl" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / Region" />
              </div>
            </div>
          </div>

          {role === "dentist" && (
            <div className="space-y-2">
              <Label htmlFor="license" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Professional License</Label>
              <div className="relative group">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="license" className="pl-9 h-14 bg-secondary/5 border-2 border-border/50 rounded-xl" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} required placeholder="REG-000000" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-9 pr-10 h-14 bg-secondary/5 border-2 border-border/50 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <ActionButton 
            type="submit" 
            fullWidth 
            disabled={loading} 
            loading={loading}
            className="h-16 text-lg font-black tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            icon={!loading && <ChevronRight className="w-5 h-5" />}
          >
            Create Account
          </ActionButton>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Existing practitioner?{" "}
          <Link to="/login" className="font-black text-primary uppercase tracking-widest hover:underline underline-offset-8 decoration-2">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
