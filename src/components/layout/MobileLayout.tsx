import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  centered?: boolean;
}

export function MobileLayout({ children, className = "", noPadding = false, centered = false }: MobileLayoutProps) {
  return (
    <div className={`page-container ${noPadding ? "" : "px-4"} ${centered ? "centered-container" : ""} ${className}`}>
      {children}
    </div>
  );
}
