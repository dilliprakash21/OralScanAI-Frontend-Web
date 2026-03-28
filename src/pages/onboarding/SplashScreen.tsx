import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Shield, Activity, Fingerprint } from "lucide-react";

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
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-12 relative z-10">
        {/* Core Unit */}
        <div className="relative group">
          <div className="w-36 h-36 bg-card border-2 border-primary/20 rounded-[3rem] flex items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden relative animate-in zoom-in duration-1000">
            <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain p-8" />
            
            {/* Animated Scanning Bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-1/2 w-full animate-scan-y opacity-50" />
          </div>
          
          {/* Pulsing Rings */}
          <div className="absolute -inset-6 bg-primary/5 rounded-[3.5rem] animate-pulse-slow -z-10" />
          <div className="absolute -inset-12 bg-primary/[0.02] rounded-[4rem] animate-pulse-slow [animation-delay:500ms] -z-10" />
        </div>

        {/* Identity & Status */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
              OralScan <br/>
              <span className="text-primary font-outline-1 text-transparent font-black">AI</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">Oral Health Screening System</p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4">
             <div className="flex flex-col items-center gap-1">
                <Shield className="w-4 h-4 text-primary opacity-20" />
                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Secure</span>
             </div>
             <div className="w-px h-8 bg-border/40" />
             <div className="flex flex-col items-center gap-1">
                <Activity className="w-4 h-4 text-primary opacity-20" />
                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Real-time</span>
             </div>
             <div className="w-px h-8 bg-border/40" />
             <div className="flex flex-col items-center gap-1">
                <Fingerprint className="w-4 h-4 text-primary opacity-20" />
                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Encrypted</span>
             </div>
          </div>
        </div>

        {/* System Initialization Indicator */}
        <div className="absolute bottom-20 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-500">
           <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
           </div>
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Initializing system...</p>
        </div>
      </div>

      <div className="absolute bottom-8 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
        Simats Engineering • Advanced Diagnostics Group
      </div>
    </div>
  );
}
