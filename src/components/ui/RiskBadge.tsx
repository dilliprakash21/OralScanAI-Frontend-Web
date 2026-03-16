interface RiskBadgeProps {
  level: "low" | "medium" | "high";
  size?: "small" | "default" | "large";
}

export function RiskBadge({ level, size = "default" }: RiskBadgeProps) {
  const labels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  };

  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full risk-${level} ${sizeClasses[size]}`}
    >
      {labels[level]}
    </span>
  );
}
