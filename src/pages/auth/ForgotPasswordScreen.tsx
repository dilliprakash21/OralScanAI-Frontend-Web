import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";

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
        title: "Reset code sent",
        description: "Please check your email for the 6-digit verification code.",
      });
    } catch (err: any) {
      setLoading(false);
      toast({
        title: "Request failed",
        description: err?.message || "Could not send reset code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEnterCode = () => {
    navigate(`/verify-otp?email=${encodeURIComponent(email)}&mode=reset`);
  };

  return (
    <MobileLayout centered className="bg-background">
      <div className="w-full max-w-sm mx-auto space-y-8 py-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-card rounded-2xl p-4 shadow-lg border border-border/50">
            <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground px-4">
              Enter the email associated with your account and we'll send you a code to reset your password.
            </p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9 h-12"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <ActionButton type="submit" fullWidth loading={loading} className="h-12 shadow-lg shadow-primary/20">
              Send Reset Code
            </ActionButton>

            <div className="text-center">
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <KeyRound className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Check your email</h2>
              <p className="text-sm text-muted-foreground px-6">
                We've sent a 6-digit verification code to <strong>{email}</strong>.
              </p>
            </div>
            <ActionButton
              onClick={handleEnterCode}
              fullWidth
              className="h-12 shadow-lg shadow-primary/20"
            >
              Enter Code
            </ActionButton>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-primary font-medium hover:underline"
            >
              Try a different email
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
