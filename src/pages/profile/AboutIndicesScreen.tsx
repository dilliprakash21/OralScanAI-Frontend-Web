import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
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
    <MobileLayout className="pb-6">
      <ScreenHeader title="About Clinical Indices" onBack={() => navigate("/profile")} />

      <div className="px-4 pt-4 space-y-5 animate-fade-in">
        <p className="text-sm text-muted-foreground leading-relaxed">
          OralScan AI uses the following validated clinical indices to assess oral health status.
        </p>

        {indices.map((idx) => (
          <div key={idx.name} className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-5 py-4">
              <p className="font-bold text-primary-foreground">{idx.name}</p>
              <p className="text-xs text-primary-foreground/70 mt-0.5">{idx.full}</p>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{idx.description}</p>

              {/* Score Table */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Scoring</p>
                {idx.scores.map(({ score, desc }) => (
                  <div key={score} className="flex items-start gap-3">
                    <span className="w-12 text-center bg-muted rounded-lg py-1 text-sm font-bold text-foreground flex-shrink-0">
                      {score}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Interpretation */}
              <div className="bg-accent rounded-xl p-3">
                <p className="text-xs font-semibold text-foreground mb-1">Interpretation</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{idx.interpretation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
