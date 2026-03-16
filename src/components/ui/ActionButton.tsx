import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "success" | "destructive";
  size?: "default" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  type?: "button" | "submit";
  className?: string;
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  size = "default",
  fullWidth = true,
  disabled = false,
  loading = false,
  icon,
  type = "button",
  className = "",
}: ActionButtonProps) {
  const baseClasses = "flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const sizeClasses = {
    default: "h-14 px-6 text-base",
    large: "h-16 px-8 text-lg",
  };

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/5",
    success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
