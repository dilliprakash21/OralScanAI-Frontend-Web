import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ShieldCheck, Mail, ChevronRight, Fingerprint } from "lucide-react";

export default function OTPVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";
  const mode = queryParams.get("mode") || "signup";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast({ title: "Email Missing", description: "Please restart registration.", variant: "destructive" });
      navigate("/signup");
    }
  }, [email, navigate, toast]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length < 6) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await api.auth.verifySignup({ email, code });
        if (res.ok) {
          toast({ title: "Email Verified", description: "Welcome to the OralScan clinical network." });
          navigate("/dashboard");
        }
      } else {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
      }
    } catch (err: any) {
      toast({
        title: "Verification Failure",
        description: err?.message || "Invalid or expired verification code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code]);

  return (
    <AuthLayout 
      title="Verify Code" 
      subtitle="Verifying your identity."
    >
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] flex items-center justify-center text-primary shadow-xl animate-pulse-slow">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div className="space-y-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full border border-border/40">
                <Mail className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{email}</span>
             </div>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="space-y-6">
            <p className="text-center text-xs font-medium text-muted-foreground leading-relaxed px-6">
              A 6-digit verification code has been dispatched. Enter it below to verify your account.
            </p>

            <div className="flex justify-center relative group">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className="h-24 text-center text-5xl font-black tracking-[0.4em] w-full max-w-[320px] bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-[2rem] transition-all font-mono"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                autoFocus
              />
              
              {/* Subtle scanner effect over input */}
              <div className="absolute inset-0 pointer-events-none rounded-[2rem] overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-scan-y" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <ActionButton 
              type="submit" 
              fullWidth 
              disabled={loading || code.length < 6} 
              loading={loading} 
              className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              icon={!loading && <ChevronRight className="w-6 h-6" />}
            >
              Verify Code
            </ActionButton>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-8 decoration-2"
            >
              Change Email
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/5 border border-border/30 rounded-full">
           <Fingerprint className="w-4 h-4 text-primary opacity-40" />
           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Biometric Fallback Disabled</p>
        </div>
      </div>
    </AuthLayout>
  );
}
