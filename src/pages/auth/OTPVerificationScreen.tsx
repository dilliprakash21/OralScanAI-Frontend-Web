import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { ShieldCheck, Mail } from "lucide-react";

export default function OTPVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";
  const mode = queryParams.get("mode") || "signup"; // signup or reset

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast({ title: "Email missing", description: "Please sign up again.", variant: "destructive" });
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
          toast({ title: "Account verified!", description: "Welcome to OralScan AI." });
          navigate("/dashboard");
        }
      } else {
        // forgot password mode
        // For reset, we just verify the code works, then navigate to reset page
        // But the backend reset-password endpoint takes the code too.
        // So we'll just navigate to reset page with the code.
        navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
      }
    } catch (err: any) {
      toast({
        title: "Verification failed",
        description: err?.message || "Invalid or expired code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code]);

  return (
    <MobileLayout centered className="bg-background">
      <div className="w-full max-w-sm mx-auto space-y-8 py-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse-slow">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Verify your email</h1>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" /> {email}
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6 animate-slide-up">
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground px-4">
              Enter the 6-digit verification code sent to your email address.
            </p>

            <div className="flex justify-center">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className="h-16 text-center text-3xl font-bold tracking-[0.5em] w-full max-w-[240px] border-2 focus:border-primary"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                autoFocus
              />
            </div>
          </div>

          <ActionButton type="submit" fullWidth disabled={loading || code.length < 6} loading={loading} className="h-12 shadow-lg shadow-primary/20">
            Verify Code
          </ActionButton>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              Didn't receive a code? Use a different email
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
}
