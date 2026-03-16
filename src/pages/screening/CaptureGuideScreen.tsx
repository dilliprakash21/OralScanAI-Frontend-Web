import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { ProgressSteps } from "@/components/layout/ProgressSteps";
import { Camera, Sun, Focus, Move } from "lucide-react";

const tips = [
  { icon: Sun, title: "Good Lighting", desc: "Use a bright, direct light source. Avoid shadows on oral cavity" },
  { icon: Focus, title: "Sharp Focus", desc: "Hold steady and ensure the image is clear before capturing" },
  { icon: Move, title: "Correct Angle", desc: "Capture the entire oral cavity including tongue, cheeks, and palate" },
  { icon: Camera, title: "Full Coverage", desc: "Ensure Toluidine Blue stained areas are clearly visible" },
];

export default function CaptureGuideScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout className="pb-6">
      <ScreenHeader title="Capture Guide" onBack={() => navigate("/screening/dye-instruction")} />
      <ProgressSteps currentStep={4} totalSteps={8} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 py-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Image Capture Tips</h2>
            <p className="text-muted-foreground text-sm mt-1">Follow these guidelines for best AI results</p>
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-3">
          {tips.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{title}</p>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Frame */}
        <div className="bg-black rounded-2xl aspect-[4/3] flex items-center justify-center border-2 border-primary/30 relative overflow-hidden">
          {/* Guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-primary/60 rounded-xl w-3/4 h-3/4 flex items-center justify-center">
              <div className="text-primary/60 text-center">
                <Camera className="w-10 h-10 mx-auto mb-2" />
                <p className="text-xs font-medium">Position oral cavity here</p>
              </div>
            </div>
          </div>
          {/* Corner guides */}
          {[["top-3 left-3", "border-t-2 border-l-2"],
            ["top-3 right-3", "border-t-2 border-r-2"],
            ["bottom-3 left-3", "border-b-2 border-l-2"],
            ["bottom-3 right-3", "border-b-2 border-r-2"]].map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-6 h-6 ${border} border-primary`} />
          ))}
        </div>

        <ActionButton onClick={() => navigate("/screening/capture")}>
          Start Image Capture
        </ActionButton>
      </div>
    </MobileLayout>
  );
}
