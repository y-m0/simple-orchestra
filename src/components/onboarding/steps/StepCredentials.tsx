
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { OnboardingActions } from "@/components/onboarding/OnboardingActions";
import { Lock, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepCredentialsProps {
  formData: {
    username: string;
    password: string;
  };
  updateFormData: (data: Partial<{ username: string; password: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCredentials({ formData, updateFormData, onNext, onBack }: StepCredentialsProps) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  
  useEffect(() => {
    const { username, password } = formData;
    const passwordMatch = password === confirmPassword;
    setPasswordsMatch(passwordMatch);
    setIsFormValid(
      username.trim().length >= 3 && 
      password.length >= 8 && 
      passwordMatch
    );
  }, [formData, confirmPassword]);

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <OnboardingCard 
      title="Create Your Account" 
      description="Set up your login credentials to access your dashboard."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => updateFormData({ username: e.target.value })}
              className="pl-10"
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Username must be at least 3 characters long</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              className="pl-10"
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`pl-10 ${
                !passwordsMatch && confirmPassword 
                  ? "border-destructive focus-visible:ring-destructive" 
                  : ""
              }`}
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          {!passwordsMatch && confirmPassword && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>
      </div>
      
      <OnboardingActions 
        onNext={onNext} 
        onBack={onBack} 
        nextLabel="Create Account" 
        isLastStep={true}
        disableNext={!isFormValid}
      />
    </OnboardingCard>
  );
}
