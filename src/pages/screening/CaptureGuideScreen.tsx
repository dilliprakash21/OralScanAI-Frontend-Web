import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">Image Capture Protocol</h1>
            <p className="text-muted-foreground font-medium">Step 4: Ensuring clinical quality for AI analysis</p>
          </div>
          <div className="flex-1 md:max-w-xs">
            <ProgressSteps currentStep={4} totalSteps={7} />
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-12 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Tips */}
            <div className="space-y-8">
              <div className="flex items-center gap-6 pb-6 border-b border-border/30">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground">Clinical Guidelines</h2>
                  <p className="text-muted-foreground font-medium mt-1">Optimization tips for best diagnostic results</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tips.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-secondary/20 border border-border/40 rounded-3xl p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-foreground text-lg mb-1">{title}</p>
                      <p className="text-muted-foreground font-medium text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Preview Frame */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Focus className="w-5 h-5 text-primary" />
                Capture Interface Preview
              </h3>
              <div className="bg-slate-950 rounded-[2rem] aspect-square lg:aspect-auto lg:h-full flex items-center justify-center border-4 border-slate-900 relative overflow-hidden shadow-inner group">
                {/* Guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary/40 border-dashed rounded-[3rem] w-3/4 h-3/4 flex items-center justify-center animate-pulse">
                    <div className="text-primary/40 text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm font-black uppercase tracking-widest">Position Oral Cavity Here</p>
                    </div>
                  </div>
                </div>

                {/* Corner guides */}
                {[["top-8 left-8", "border-t-4 border-l-4"],
                  ["top-8 right-8", "border-t-4 border-r-4"],
                  ["bottom-8 left-8", "border-b-4 border-l-4"],
                  ["bottom-8 right-8", "border-b-4 border-r-4"]].map(([pos, border], i) => (
                  <div key={i} className={`absolute ${pos} w-10 h-10 ${border} border-primary/60`} />
                ))}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                   <p className="text-[10px] text-white/60 font-black tracking-tighter uppercase">Intelligent Viewfinder Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex items-center justify-between gap-6">
            <button 
              onClick={() => navigate("/screening/dye-instruction")}
              className="px-8 py-5 rounded-[1.5rem] font-black text-muted-foreground hover:bg-secondary transition-all"
            >
              BACK
            </button>
            <button 
              onClick={() => navigate("/screening/capture")} 
              className="flex-1 max-w-md bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              START CLINICAL CAPTURE
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
