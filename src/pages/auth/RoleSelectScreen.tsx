import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Stethoscope, Heart, Shield, ChevronRight } from "lucide-react";

export default function RoleSelectScreen() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "dentist",
      icon: Stethoscope,
      title: "Clinical Dentist",
      description: "Licensed professional conducting precision diagnostic screenings.",
      color: "text-primary bg-primary/10",
    },
    {
      id: "health-worker",
      icon: Heart,
      title: "Health Worker",
      description: "Community specialist trained in regional oral health screening.",
      color: "text-success bg-success/10",
    },
  ];

  const handleRoleSelect = (role: string) => {
    localStorage.setItem("userRole", role);
    navigate("/signup");
  };

  return (
    <AuthLayout 
      title="Identity Selection" 
      subtitle="Define your professional capacity within the OralScan ecosystem."
    >
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {roles.map((role, index) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="w-full text-left flex items-center gap-6 p-6 rounded-[2rem] bg-secondary/5 border-2 border-transparent hover:border-primary/30 hover:bg-secondary/10 transition-all group relative overflow-hidden active:scale-[0.98]"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${role.color}`}>
              <role.icon className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-lg font-black text-foreground uppercase tracking-tight transition-colors group-hover:text-primary">{role.title}</p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">{role.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all group-hover:translate-x-1" />
            
            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-border/40 text-center">
         <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-relaxed">
            Role selection determines clinical <br/>
            permissions & diagnostic scope.
         </p>
      </div>
    </AuthLayout>
  );
}
