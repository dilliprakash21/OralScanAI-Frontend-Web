import { Link } from "react-router-dom";
import { Mail, Shield } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t border-border mt-auto pt-10 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white border border-border/20 rounded-xl p-1 shadow-sm flex items-center justify-center">
                <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black text-foreground tracking-tighter uppercase">OralScan AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Advanced oral health screening platform powered by AI. Providing professional diagnostic tools for clinical accuracy and community health.
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Support</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:oralscanai@gmail.com" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>oralscanai@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Clinical Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about-indices" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Plaque & Gingival Indices
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  System Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            © {currentYear} OralScan AI • SIMATS ENGINEERING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-success">
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
