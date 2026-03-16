import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Shield, Users, Zap } from "lucide-react";
import oralScanLogo from "@/assets/oralscan-logo.png";

export default function IntroScreen() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Screening",
      description: "Instant plaque and gingival index analysis",
    },
    {
      icon: Shield,
      title: "Clinical Accuracy",
      description: "Validated detection algorithms",
    },
    {
      icon: Users,
      title: "Camp Mode",
      description: "Screen multiple patients efficiently",
    },
  ];

  return (
    <MobileLayout className="justify-between py-8">
      {/* Header */}
      <div className="text-center pt-8 animate-fade-in">
        <div className="w-20 h-20 bg-primary-foreground rounded-2xl flex items-center justify-center mx-auto shadow-lg overflow-hidden">
          <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-6">
          Welcome to OralScan AI
        </h1>
        <p className="text-muted-foreground mt-2 px-4">
          Professional dental screening tool for community health camps
        </p>
      </div>

      {/* Features */}
      <div className="flex-1 flex flex-col justify-center gap-4 py-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{feature.title}</p>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3 animate-fade-in">
        <ActionButton onClick={() => navigate("/tutorial")}>
          Get Started
        </ActionButton>
        <ActionButton variant="outline" onClick={() => navigate("/login")}>
          Sign In
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
