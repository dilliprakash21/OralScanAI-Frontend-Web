import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Camera, Droplets, FileCheck, ChevronRight, Binary, Fingerprint, Sparkles } from "lucide-react";

const tutorialSlides = [
  {
    icon: Droplets,
    title: "Sync Contrast",
    description:
      "Apply plaque disclosing dye to the patient's teeth. This stains plaque deposits, allowing the AI to differentiate between health and infection.",
    color: "bg-info",
    accent: "text-info",
    scanLine: "bg-info/20",
  },
  {
    icon: Camera,
    title: "Neural Vision",
    description:
      "Capture the frontal perspective. Our vision models analyze the high-entropy disclosing dye patterns to calculate clinical metrics.",
    color: "bg-success",
    accent: "text-success",
    scanLine: "bg-success/20",
  },
  {
    icon: Sparkles,
    title: "Synthesized Results",
    description:
      "Receive instant pathological assessments and risk stratification. Generate encrypted reports for patient follow-up.",
    color: "bg-warning",
    accent: "text-warning",
    scanLine: "bg-warning/20",
  },
];

export default function TutorialScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/role-select");
    }
  };

  const slide = tutorialSlides[currentSlide];

  return (
    <AuthLayout title="System Tutorial" subtitle="Synchronizing operational protocols.">
      <div className="relative min-h-[450px] flex flex-col items-center justify-between py-4">
        {/* Skip Button */}
        <div className="absolute top-0 right-0 z-20">
          <button
            onClick={() => navigate("/role-select")}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors px-4 py-2"
          >
            Override
          </button>
        </div>

        {/* Slide Content */}
        <div 
          key={currentSlide}
          className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-700"
        >
          <div className="relative mb-12 group">
            {/* Holographic background effect */}
            <div className={`absolute -inset-8 ${slide.color}/10 rounded-full blur-3xl animate-pulse group-hover:${slide.color}/20 transition-all`} />
            
            <div className={`w-32 h-32 ${slide.color} rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl transition-transform hover:scale-110 duration-500`}>
              <slide.icon className="w-16 h-16 text-white" />
              
              {/* Animated scan line */}
              <div className={`absolute inset-x-0 h-0.5 ${slide.scanLine} animate-scan-y top-0`} />
            </div>

            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-card border border-border/40 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
               <Binary className={`w-6 h-6 ${slide.accent}`} />
            </div>
          </div>

          <div className="space-y-4 max-w-xs mx-auto">
            <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">{slide.title}</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="w-full space-y-8 mt-12">
          {/* Progress Indicators */}
          <div className="flex justify-center gap-3">
            {tutorialSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentSlide ? "w-10 bg-primary" : "w-1.5 bg-muted hover:bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <ActionButton 
              onClick={handleNext} 
              className="h-20 text-lg font-black tracking-[0.2em] uppercase rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              icon={<ChevronRight className="w-6 h-6" />}
            >
              {currentSlide < tutorialSlides.length - 1 ? "Next Protocol" : "Initialize System"}
            </ActionButton>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/5 border border-border/30 rounded-full">
           <Fingerprint className="w-3 h-3 text-muted-foreground opacity-50" />
           <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Session Identification Layer Active</p>
        </div>
      </div>
    </AuthLayout>
  );
}
