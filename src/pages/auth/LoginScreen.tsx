import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
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
      toast({ title: "Welcome back!", description: "Session authenticated successfully." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err?.message || "Please check your clinical credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Login" 
      subtitle="Access your account."
    >
      <form onSubmit={handleLogin} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Email Address
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

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Password
              </Label>
              <Link 
                to="/forgot-password" 
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Lock className="w-full h-full" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-12 pr-12 h-16 bg-secondary/5 border-2 border-border/50 focus:border-primary/50 rounded-2xl transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
        </div>

        <div className="pt-2">
          <ActionButton 
            type="submit" 
            fullWidth 
            disabled={loading} 
            loading={loading}
            className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            icon={!loading && <ChevronRight className="w-6 h-6" />}
          >
            Sign In
          </ActionButton>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs font-medium text-muted-foreground">
            New practitioner?{" "}
            <Link to="/signup" className="font-black text-primary uppercase tracking-widest hover:underline underline-offset-8 decoration-2">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
