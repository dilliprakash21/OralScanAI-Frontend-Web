import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import oralScanLogo from "@/assets/oralscan-logo.png";

export default function SplashScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/intro");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="mobile-screen items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <div className="w-28 h-28 bg-primary-foreground rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
            <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -inset-4 bg-primary-foreground/20 rounded-[2rem] animate-pulse-ring" />
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-foreground">
            OralScan AI
          </h1>
          <p className="text-primary-foreground/80 mt-2 text-sm">
            AI Plaque & Gingival Screening
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex gap-1.5 mt-8">
          <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
