import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-12 animate-fade-in">
          {/* Left: Interactive FAQ */}
          <div className="flex-[3] space-y-10">
            <div>
              <h1 className="text-4xl font-black text-foreground mb-3">System Help Center</h1>
              <p className="text-muted-foreground font-medium text-lg">Detailed answers to operational protocols and common questions</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Operational Documentation (FAQ)</h3>
              <div className="grid grid-cols-1 gap-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="group bg-card border-2 border-border/50 rounded-3xl p-8 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 shadow-sm">
                    <div className="flex gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                          <HelpCircle className="w-6 h-6" />
                       </div>
                       <div className="space-y-2">
                          <p className="text-xl font-black text-foreground leading-snug">{faq.q}</p>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">{faq.a}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Direct Support Channel */}
          <div className="flex-[2] space-y-8">
             <div className="bg-primary border border-primary/20 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                {/* Decorative background logo */}
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                   <HelpCircle className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 space-y-10">
                   <div className="space-y-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                         <Mail className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black leading-tight">Need Immediate Assistance?</h3>
                      <p className="text-white/80 font-medium">Our clinical support team is available for high-priority technical queries.</p>
                   </div>

                    <div className="space-y-4">
                       <a 
                         href="mailto:oralscanai@gmail.com"
                         className="p-6 bg-white/10 rounded-2xl border border-white/20 flex items-center gap-4 hover:bg-white/20 transition-all cursor-pointer group/item block"
                       >
                          <Mail className="w-6 h-6 text-white" />
                          <div className="min-w-0">
                             <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">EMAIL SUPPORT</p>
                             <p className="text-sm font-black truncate">oralscanai@gmail.com</p>
                          </div>
                       </a>
                    </div>

                   <button className="w-full py-5 bg-white text-primary rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                      CREATE SUPPORT TICKET
                   </button>
                </div>
             </div>

             <div className="p-10 bg-secondary/20 border border-border/50 rounded-[2.5rem] space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Service Lifecycle</p>
                <div className="flex items-center justify-between text-xs">
                   <span className="font-bold">System Status:</span>
                   <span className="text-success font-black flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      OPERATIONAL
                   </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="font-bold">Avg. Response Time:</span>
                   <span className="text-foreground font-black">~15 MINUTES</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
