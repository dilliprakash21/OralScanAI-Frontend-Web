import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Info, AlertCircle } from "lucide-react";

const indices = [
  {
    name: "Plaque Index (PI)",
    full: "Silness and Löe Plaque Index",
    description: "Measures the amount of dental plaque at the gingival margin using a 0–3 scale.",
    scores: [
      { score: "0", desc: "No plaque" },
      { score: "1", desc: "Thin plaque film at gingival margin (visible on probe)" },
      { score: "2", desc: "Moderate accumulation of plaque" },
      { score: "3", desc: "Abundant plaque, interdental space filled" },
    ],
    interpretation: "PI < 1.0 = Good; 1.0–2.0 = Fair; > 2.0 = Poor oral hygiene",
  },
  {
    name: "Gingival Index (GI)",
    full: "Löe and Silness Gingival Index",
    description: "Assesses gingival inflammation and bleeding tendency on a 0–3 scale.",
    scores: [
      { score: "0", desc: "Normal gingiva — no inflammation" },
      { score: "1", desc: "Mild inflammation, slight colour change, no bleeding" },
      { score: "2", desc: "Moderate inflammation, bleeding on probing" },
      { score: "3", desc: "Severe inflammation, spontaneous bleeding, ulceration" },
    ],
    interpretation: "GI < 1.0 = Mild; 1.0–2.0 = Moderate; > 2.0 = Severe gingivitis",
  },
  {
    name: "AI Confidence Score",
    full: "OralScan AI Confidence Metric",
    description: "Indicates the AI model's certainty in the risk classification, expressed as a percentage.",
    scores: [
      { score: "≥ 90%", desc: "Very high confidence — strong indicator" },
      { score: "75–89%", desc: "High confidence — reliable assessment" },
      { score: "60–74%", desc: "Moderate confidence — clinical review advised" },
      { score: "< 60%", desc: "Low confidence — manual assessment required" },
    ],
    interpretation: "Scores below 75% should be treated with additional clinical scrutiny.",
  },
];

export default function AboutIndicesScreen() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-3 uppercase tracking-tight">Clinical Index Encyclopedia</h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
            Scientific documentation of the validated oral health metrics used by the OralScan AI diagnostic engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
          {indices.map((idx) => (
            <div key={idx.name} className="flex flex-col bg-card border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm hover:border-primary/30 transition-all group">
              {/* Header */}
              <div className="bg-primary p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                   <Info className="w-20 h-20 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white leading-tight">{idx.name}</h3>
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-1">{idx.full}</p>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col space-y-8">
                <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
                  "{idx.description}"
                </p>

                {/* Score Table */}
                <div className="space-y-4 flex-1">
                  <p className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                     <div className="w-4 h-1 bg-primary rounded-full" />
                     Standardized Scoring Table
                  </p>
                  <div className="space-y-3">
                    {idx.scores.map(({ score, desc }) => (
                      <div key={score} className="flex items-start gap-4 p-3 rounded-2xl bg-secondary/10 border border-border/50">
                        <span className="w-14 h-8 flex items-center justify-center bg-white border border-border rounded-xl text-sm font-black text-primary shrink-0 shadow-sm">
                          {score}
                        </span>
                        <p className="text-xs text-foreground font-semibold leading-relaxed pt-1.5">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interpretation */}
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-primary" />
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest">Clinical Interpretation</p>
                  </div>
                  <p className="text-xs text-foreground font-bold leading-relaxed">{idx.interpretation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <p className="text-xs text-muted-foreground font-medium italic">
             References: Silness & Löe (1964), Löe & Silness (1963). Certified for OralScan AI Platform 2.0.
           </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
