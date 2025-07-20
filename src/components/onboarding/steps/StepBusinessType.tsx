
import { useState } from "react";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { OnboardingActions } from "@/components/onboarding/OnboardingActions";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { BriefcaseIcon, Paintbrush, Code } from "lucide-react";

interface StepBusinessTypeProps {
  formData: {
    businessType: string;
  };
  updateFormData: (data: Partial<{ businessType: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

type BusinessTypeOption = {
  id: string;
  label: string;
  icon: React.ElementType;
};

export function StepBusinessType({ formData, updateFormData, onNext, onBack }: StepBusinessTypeProps) {
  const isMobile = useIsMobile();
  
  const businessTypes: BusinessTypeOption[] = [
    { id: "marketing", label: "Marketing Agency", icon: BriefcaseIcon },
    { id: "development", label: "Software Development Agency", icon: Code },
    { id: "design", label: "Graphic Design", icon: Paintbrush }
  ];

  const handleSelect = (businessType: string) => {
    updateFormData({ businessType });
  };

  return (
    <OnboardingCard 
      title="What type of business are you?" 
      description="This helps us tailor our services to your specific needs."
    >
      <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4 mt-4`}>
        {businessTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.businessType === type.id;
          
          return (
            <Card
              key={type.id}
              className={`relative cursor-pointer transition-all p-6 flex flex-col items-center justify-center gap-4 
                ${isSelected ? "bg-primary/10 border-primary" : "hover:bg-accent"}`}
              onClick={() => handleSelect(type.id)}
            >
              <div className={`rounded-full p-4 ${isSelected ? "bg-primary/20" : "bg-secondary"}`}>
                <Icon className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">{type.label}</h3>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary"></div>
              )}
            </Card>
          );
        })}
      </div>
      
      <OnboardingActions 
        onNext={onNext} 
        onBack={onBack} 
        disableNext={!formData.businessType}
      />
    </OnboardingCard>
  );
}
