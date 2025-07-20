
import { useState } from "react";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { OnboardingActions } from "@/components/onboarding/OnboardingActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepBusinessSizeProps {
  formData: {
    businessSize: string;
  };
  updateFormData: (data: Partial<{ businessSize: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

type BusinessSizeOption = {
  id: string;
  label: string;
  description: string;
};

export function StepBusinessSize({ formData, updateFormData, onNext, onBack }: StepBusinessSizeProps) {
  const isMobile = useIsMobile();
  
  const businessSizes: BusinessSizeOption[] = [
    { id: "solo", label: "Solo", description: "Just myself" },
    { id: "small", label: "Small Team", description: "2-10 employees" },
    { id: "medium", label: "Medium Business", description: "11-50 employees" },
    { id: "large", label: "Large Business", description: "51-200 employees" },
    { id: "enterprise", label: "Enterprise", description: "201+ employees" }
  ];

  const handleSelect = (businessSize: string) => {
    updateFormData({ businessSize });
  };

  return (
    <OnboardingCard 
      title="What's your business size?" 
      description="This helps us recommend the right resources for your team."
    >
      <div className="space-y-3 mt-4">
        {businessSizes.map((size) => {
          const isSelected = formData.businessSize === size.id;
          
          return (
            <div
              key={size.id}
              className={`p-4 rounded-md border cursor-pointer transition-all
                ${isSelected 
                  ? "bg-primary/10 border-primary" 
                  : "hover:bg-accent"}`}
              onClick={() => handleSelect(size.id)}
            >
              <div className="flex items-center">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => handleSelect(size.id)}
                />
                <div className="ml-3">
                  <Label htmlFor={size.id} className="font-medium cursor-pointer">
                    {size.label}
                  </Label>
                  <p className="text-muted-foreground text-sm">{size.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <OnboardingActions 
        onNext={onNext} 
        onBack={onBack} 
        disableNext={!formData.businessSize}
      />
    </OnboardingCard>
  );
}
