import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ActionButton } from "@/components/ui/ActionButton";
import { Camera, Droplets, FileCheck, ChevronRight } from "lucide-react";

const tutorialSlides = [
  {
    icon: Droplets,
    title: "Apply Disclosing Dye",
    description:
      "Apply plaque disclosing dye to the patient's teeth. This stains plaque deposits, making them visible for accurate AI detection.",
    color: "bg-info",
  },
  {
    icon: Camera,
    title: "Capture Frontal View",
    description:
      "Take a photo of the front teeth. Our AI analyzes the colored plaque areas to calculate Plaque and Gingival Index scores.",
    color: "bg-success",
  },
  {
    icon: FileCheck,
    title: "Review & Save",
    description:
      "Get instant risk assessment. Save records for follow-up and generate reports for patients.",
    color: "bg-warning",
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

  const handleSkip = () => {
    navigate("/role-select");
  };

  const slide = tutorialSlides[currentSlide];

  return (
    <MobileLayout className="justify-between py-8">
      {/* Skip Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSkip}
          className="text-muted-foreground text-sm py-2 px-4"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className={`w-24 h-24 ${slide.color} rounded-3xl flex items-center justify-center mb-8`}>
          <slide.icon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">{slide.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{slide.description}</p>
      </div>

      {/* Dots + Next */}
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {tutorialSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
        <ActionButton onClick={handleNext} icon={currentSlide < tutorialSlides.length - 1 ? <ChevronRight className="w-5 h-5" /> : undefined}>
          {currentSlide < tutorialSlides.length - 1 ? "Next" : "Get Started"}
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
