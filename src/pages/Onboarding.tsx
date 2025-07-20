
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { StepName } from "@/components/onboarding/steps/StepName";
import { StepBusiness } from "@/components/onboarding/steps/StepBusiness";
import { StepBusinessType } from "@/components/onboarding/steps/StepBusinessType";
import { StepAddress } from "@/components/onboarding/steps/StepAddress";
import { StepBusinessSize } from "@/components/onboarding/steps/StepBusinessSize";
import { StepCredentials } from "@/components/onboarding/steps/StepCredentials";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useIsMobile } from "@/hooks/use-mobile";

type OnboardingData = {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessDescription: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  businessSize: string;
  username: string;
  password: string;
};

export default function Onboarding() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    businessDescription: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    businessSize: "",
    username: "",
    password: ""
  });

  const steps = [
    "Name & Email",
    "Business Info",
    "Business Type",
    "Address",
    "Business Size",
    "Credentials"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Submit form data and redirect to dashboard
      console.log("Form submitted:", formData);
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData({ ...formData, ...data });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepName formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 1:
        return <StepBusiness formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <StepBusinessType formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepAddress formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <StepBusinessSize formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <StepCredentials formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout>
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className={`mb-8 ${!isMobile ? "px-6" : "px-2"}`}>
          <OnboardingProgress currentStep={currentStep} totalSteps={steps.length} />
        </div>
        {renderStep()}
      </div>
    </OnboardingLayout>
  );
}
