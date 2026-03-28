import { ReactNode } from "react";
import { Shield, Activity, Brain } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function AuthLayout({ children, title, subtitle, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Immersive Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow ml-20" />
      
      {/* Decorative Icons */}
      <div className="absolute top-20 right-20 opacity-5 rotate-12 hidden lg:block">
        <Shield className="w-64 h-64 text-primary" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-5 -rotate-12 hidden lg:block">
        <Activity className="w-48 h-48 text-primary" />
      </div>
      <div className="absolute top-1/2 left-10 opacity-[0.02] hidden xl:block">
        <Brain className="w-96 h-96 text-primary" />
      </div>

      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Branding & Context (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col space-y-12 pr-12">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-card border border-border/50 rounded-3xl p-4 shadow-2xl">
              <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
                OralScan <br/>
                <span className="text-primary font-outline-2 text-transparent">AI</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
                Empowering healthcare practitioners with AI-driven oral health screenings at the edge.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-card/50 backdrop-blur-xl border border-border/40 rounded-3xl space-y-2 group hover:border-primary/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-foreground">Secure Data</p>
              <p className="text-[10px] text-muted-foreground font-medium">End-to-end encrypted clinical records.</p>
            </div>
            <div className="p-6 bg-card/50 backdrop-blur-xl border border-border/40 rounded-3xl space-y-2 group hover:border-primary/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-foreground">AI Analysis</p>
              <p className="text-[10px] text-muted-foreground font-medium">Real-time plaque & gingival indexing.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-card/70 backdrop-blur-2xl border border-border/50 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden">
            {/* Mobile Logo */}
            {showLogo && (
              <div className="lg:hidden flex justify-center mb-8">
                <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl border border-border/20">
                  <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
                </div>
              </div>
            )}

            {(title || subtitle) && (
              <div className="text-center mb-10 space-y-2">
                {title && <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">{title}</h2>}
                {subtitle && <p className="text-muted-foreground font-medium">{subtitle}</p>}
              </div>
            )}

            {children}
            
            {/* Decorative line */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-primary/10 rounded-tr-[3rem] pointer-events-none" />
          </div>
          
          <p className="mt-8 text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
            OralScan AI Platform v2.0.0 • SIMATS Engineering
          </p>
        </div>
      </div>
    </div>
  );
}
