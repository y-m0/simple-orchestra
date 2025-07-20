
import { cn } from "@/lib/utils";

interface OnboardingCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function OnboardingCard({ title, description, children }: OnboardingCardProps) {
  return (
    <div className="w-full rounded-lg shadow-md border border-border bg-card overflow-hidden">
      <div className="px-6 py-6 md:px-8 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mb-6 text-muted-foreground">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
