import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      toast({ title: "Logged in" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout centered className="bg-background">
      <div className="w-full max-w-sm mx-auto space-y-8 py-10">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-card rounded-3xl p-4 shadow-xl border border-border/50 animate-fade-in">
            <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Log in to your OralScan AI account</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 animate-slide-up">
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-10 h-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" virtual-link-id="forgot-password" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </div>

          <ActionButton type="submit" fullWidth disabled={loading} className="h-12 text-base shadow-lg shadow-primary/20">
            {loading ? "Logging in..." : "Login"}
          </ActionButton>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" virtual-link-id="signup" className="font-semibold text-primary hover:underline underline-offset-4">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
}
