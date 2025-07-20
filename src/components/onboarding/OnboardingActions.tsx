
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingActionsProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  isLastStep?: boolean;
  disableNext?: boolean;
}

export function OnboardingActions({ 
  onNext, 
  onBack, 
  nextLabel = "Continue", 
  isLastStep = false,
  disableNext = false 
}: OnboardingActionsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? "flex-col gap-3" : "flex-row justify-between"} mt-8`}>
      {onBack ? (
        <Button 
          variant="secondary" 
          onClick={onBack}
          className={isMobile ? "w-full" : ""}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : <div></div>}
      
      <Button 
        onClick={onNext} 
        disabled={disableNext}
        className={isMobile ? "w-full" : ""}
      >
        {isLastStep ? "Complete" : nextLabel}
        {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}
