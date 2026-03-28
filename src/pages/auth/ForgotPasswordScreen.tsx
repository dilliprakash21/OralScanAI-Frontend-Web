import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Mail, KeyRound, ArrowLeft, ChevronRight } from "lucide-react";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.auth.forgotPassword({ email: email.trim().toLowerCase() });
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Code Sent",
        description: "A verification code has been dispatched to your email.",
      });
    } catch (err: any) {
      setLoading(false);
      toast({
        title: "Request Interrupted",
        description: err?.message || "Could not authorize reset request.",
        variant: "destructive",
      });
    }
  };

  const handleEnterCode = () => {
    navigate(`/verify-otp?email=${encodeURIComponent(email)}&mode=reset`);
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle={!submitted ? "Enter your email to reset your password." : "Email verified. Proceed with validation."}
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Email
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Mail className="w-full h-full" />
              </div>
              <Input
                id="email"
                type="email"
                className="pl-12 h-16 bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
              Dispatch Code
            </ActionButton>
          </div>

          <div className="text-center pt-4">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-8 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-success/5 border-2 border-success/20 text-success rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
            <KeyRound className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Transmission Sent</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed px-6">
              A 6-digit verification code has been synchronized with <br/>
              <span className="text-foreground font-bold">{email}</span>.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <ActionButton
              onClick={handleEnterCode}
              fullWidth
              className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              icon={<ChevronRight className="w-6 h-6" />}
            >
              Validate Code
            </ActionButton>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-primary/80 transition-colors"
            >
              Change Email
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
