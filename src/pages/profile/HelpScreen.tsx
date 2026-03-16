import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { HelpCircle, Mail, Phone } from "lucide-react";

export default function HelpScreen() {
  const navigate = useNavigate();
  // Feature 9: Remove the last question
  const faqs = [
    { q: "How do I start a screening?", a: "Tap 'New Screening' on the dashboard, follow the guided steps from consent to saving." },
    { q: "Why is disclosing dye needed?", a: "The dye stains plaque deposits, making them visible for the AI to detect and analyze." },
    { q: "What does the risk level mean?", a: "Risk levels (Low/Medium/High) indicate the urgency of professional dental evaluation." },
  ];

  return (
    <MobileLayout noPadding>
      <ScreenHeader title="Help & Support" onBack={() => navigate("/profile")} />
      <div className="flex-1 px-4 py-6 overflow-auto">
        <div className="bg-primary text-primary-foreground rounded-2xl p-5 mb-6">
          <HelpCircle className="w-8 h-8 mb-3" />
          <h3 className="font-semibold mb-1">Need Help?</h3>
          <p className="text-sm opacity-80 mb-4">Our support team is ready to assist you.</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /><span>support@oralscanai.com</span></div>
            <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4" /><span>+91 1800-XXX-XXXX</span></div>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-muted-foreground mb-3">FREQUENTLY ASKED QUESTIONS</h3>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-card rounded-xl p-4 border border-border/50">
              <p className="font-semibold text-foreground text-sm mb-2">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
