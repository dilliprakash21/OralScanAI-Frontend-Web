import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  centered?: boolean;
}

export function MobileLayout({ children, className = "", noPadding = false, centered = false }: MobileLayoutProps) {
  return (
    <div className={`mobile-screen ${noPadding ? "" : "px-4"} ${centered ? "justify-center" : ""} ${className}`}>
      {children}
    </div>
  );
}
