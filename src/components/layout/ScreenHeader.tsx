import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  variant?: "primary" | "transparent";
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  variant = "primary",
}: ScreenHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const baseClasses = "sticky top-0 z-10 px-4 py-4 flex items-center gap-3 safe-top";
  const variantClasses = variant === "primary"
    ? "bg-primary text-primary-foreground"
    : "bg-transparent text-foreground";

  return (
    <header className={`${baseClasses} ${variantClasses}`}>
      {showBack && (
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && (
          <p className={`text-sm ${variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}
