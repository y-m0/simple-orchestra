
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-primary">
          Step {currentStep + 1} of {totalSteps}
        </h2>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  );
}
