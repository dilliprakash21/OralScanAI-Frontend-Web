import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Eye, EyeOff, Mail, Lock, User, Stethoscope, Phone, Building2, MapPin } from "lucide-react";
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

  const rawRole = localStorage.getItem("userRole") || "health-worker";
  const role = rawRole === "health-worker" ? "health_worker" : rawRole;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast({ title: "Invalid phone", description: "Number must be exactly 10 digits.", variant: "destructive" });
      return;
    }
    if (!/^[6-9]/.test(digits)) {
      toast({ title: "Invalid phone", description: "Number must start with 6, 7, 8, or 9.", variant: "destructive" });
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

      toast({ title: "OTP Sent", description: "Please check your email for the verification code." });
      navigate(`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}&mode=signup`);
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout centered className="bg-background py-10">
      <div className="w-full max-w-sm mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-card rounded-2xl p-3 shadow-lg border border-border/50">
            <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground">Join OralScan AI as a {role.replace("_", " ")}</p>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-5 animate-slide-up">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="name" className="pl-9 h-12" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-9 h-12" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">+91</span>
                <Input
                  id="phone"
                  type="tel"
                  className="pl-12 h-12"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(val);
                  }}
                  placeholder="0000000000"
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground px-1">Must be 10 digits starting with 6-9</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinic">Clinic / Hospital</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="clinic" className="pl-9 h-12" value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Hospital name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="location" className="pl-9 h-12" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City" />
                </div>
              </div>
            </div>

            {role === "dentist" && (
              <div className="space-y-2">
                <Label htmlFor="license">License number</Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="license" className="pl-9 h-12" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Create password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <ActionButton type="submit" fullWidth disabled={loading} className="h-12 text-base shadow-lg shadow-primary/20 mt-2">
            {loading ? "Creating account..." : "Create account"}
          </ActionButton>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Login
            </Link>
          </p>
        </form>
      </div>
    </MobileLayout>
  );
}
