import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Shield, Users, Zap, ChevronRight, Binary } from "lucide-react";

export default function IntroScreen() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "AI Analysis",
      description: "Neural-driven plaque & gingival indexing.",
      delay: "100ms",
    },
    {
      icon: Shield,
      title: "Clinical Grade",
      description: "Validated diagnostic detection algorithms.",
      delay: "200ms",
    },
    {
      icon: Users,
      title: "Camp Optimized",
      description: "High-throughput community screening mode.",
      delay: "300ms",
    },
    {
      icon: Binary,
      title: "Data Integrity",
      description: "End-to-end encrypted medical record syncing.",
      delay: "400ms",
    },
  ];

  return (
    <AuthLayout showLogo={false}>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="w-24 h-24 bg-card border-2 border-primary/20 rounded-[2.5rem] p-5 shadow-2xl animate-bounce-slow">
            <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3">
             <h1 className="text-4xl font-black text-foreground tracking-tight leading-[0.95] uppercase">
              The Future of <br/>
              <span className="text-primary font-outline-1 text-transparent font-black">Oral Screening</span>
            </h1>
            <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
              Professional dental diagnostic tool engineered for community health camps and clinical accuracy.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-5 bg-card/40 backdrop-blur-md border border-border/40 rounded-[2rem] space-y-3 group hover:border-primary/30 transition-all animate-in zoom-in duration-700"
              style={{ animationDelay: feature.delay }}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{feature.title}</p>
                <p className="text-[9px] text-muted-foreground font-medium leading-tight">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="space-y-4 pt-4">
          <ActionButton 
            onClick={() => navigate("/tutorial")}
            className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            icon={<ChevronRight className="w-6 h-6" />}
          >
            Get Started
          </ActionButton>
          <div className="text-center">
            <button 
              onClick={() => navigate("/login")}
              className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors py-2"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30 flex justify-center">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary/10 rounded-full border border-border/20">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">System Online • v2.1.0</span>
           </div>
        </div>
      </div>
    </AuthLayout>
  );
}
