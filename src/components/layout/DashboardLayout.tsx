import { ReactNode } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function DashboardLayout({ children, showSidebar = true }: DashboardLayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="page-container">
      {showSidebar && user && <DesktopSidebar />}
      
      <main className={showSidebar && user ? "main-content flex flex-col min-h-screen" : "main-content-no-sidebar flex flex-col min-h-screen"}>
        <div className="max-w-7xl mx-auto pb-24 md:pb-10 pt-4 px-4 md:px-8 flex-1">
          {children}
        </div>
        <Footer />
      </main>
      
      {showSidebar && user && <BottomNav />}
    </div>
  );
}
