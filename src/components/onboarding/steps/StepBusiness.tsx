
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { OnboardingActions } from "@/components/onboarding/OnboardingActions";
import { Building } from "lucide-react";

interface StepBusinessProps {
  formData: {
    businessName: string;
    businessDescription: string;
  };
  updateFormData: (data: Partial<{ businessName: string; businessDescription: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBusiness({ formData, updateFormData, onNext, onBack }: StepBusinessProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    const { businessName, businessDescription } = formData;
    setIsFormValid(businessName.trim() !== '' && businessDescription.trim() !== '');
  }, [formData]);

  return (
    <OnboardingCard 
      title="About Your Business" 
      description="Tell us about your business so we can personalize your experience."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <div className="relative">
            <Input
              id="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) => updateFormData({ businessName: e.target.value })}
              className="pl-10"
            />
            <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessDescription">Business Description</Label>
          <Textarea
            id="businessDescription"
            placeholder="Briefly describe what your business does"
            value={formData.businessDescription}
            onChange={(e) => updateFormData({ businessDescription: e.target.value })}
            rows={4}
            className="resize-none"
          />
        </div>
      </div>
      
      <OnboardingActions onNext={onNext} onBack={onBack} disableNext={!isFormValid} />
    </OnboardingCard>
  );
}
