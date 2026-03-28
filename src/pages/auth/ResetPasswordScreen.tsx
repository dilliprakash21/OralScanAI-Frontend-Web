import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";
  const code = queryParams.get("code") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !code) {
      toast({ title: "Protocol Violation", description: "Missing identity parameters.", variant: "destructive" });
      navigate("/forgot-password");
    }
  }, [email, code, navigate, toast]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Inconsistent Input", description: "Verification keys do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Insufficient Complexity", description: "Key must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword({ email, code, password });
      setSuccess(true);
      toast({ title: "Registry Updated", description: "Your verification key has been successfully modified." });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Could not synchronize new credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Registry Restored">
        <div className="space-y-10 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-success/5 border-2 border-success/20 text-success rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Access Granted</h1>
            <p className="text-muted-foreground font-medium leading-relaxed px-4">
              Your clinical identity has been successfully updated. You may now return to the Secure Gateway.
            </p>
          </div>
          <div className="pt-4">
            <ActionButton 
              onClick={() => navigate("/login")} 
              fullWidth 
              className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              icon={<ChevronRight className="w-6 h-6" />}
            >
              Gateway Access
            </ActionButton>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Secure Calibration" 
      subtitle="Establish a new verification key for your clinical identity."
    >
      <form onSubmit={handleReset} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="password" title="New Key" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">New Verification Key</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-12 pr-12 h-16 bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" title="Confirm Key" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Validate New Key</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="pl-12 h-16 bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all font-mono"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <ActionButton 
            type="submit" 
            fullWidth 
            loading={loading} 
            className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            icon={!loading && <ChevronRight className="w-6 h-6" />}
          >
            Update Registry
          </ActionButton>
        </div>

        <div className="text-center pt-2">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Cancel Transaction
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
