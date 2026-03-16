import { Check } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressSteps({ currentStep, totalSteps, labels }: ProgressStepsProps) {
  return (
    <div className="px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {labels?.[currentStep - 1] || ""}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                isCompleted
                  ? "bg-success"
                  : isActive
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  step: number;
  status: "pending" | "active" | "completed";
}

export function StepIndicator({ step, status }: StepIndicatorProps) {
  const baseClasses = "step-indicator";
  const statusClasses = {
    pending: "step-pending",
    active: "step-active",
    completed: "step-completed",
  };

  return (
    <div className={`${baseClasses} ${statusClasses[status]}`}>
      {status === "completed" ? <Check className="w-4 h-4" /> : step}
    </div>
  );
}
