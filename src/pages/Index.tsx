
import { LandingLayout } from "@/components/layout/LandingLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesCarousel } from "@/components/landing/FeaturesCarousel";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { UseCases } from "@/components/landing/UseCases";
import { Testimonials } from "@/components/landing/Testimonials";
import { CallToAction } from "@/components/landing/CallToAction";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function Index() {
  return (
    <LandingLayout>
      <div className="flex flex-col w-full">
        <HeroSection />
        <FeaturesCarousel />
        <UseCases />
        <HowItWorks />
        <DemoPreview />
        <Testimonials />
        <CallToAction />
      </div>
    </LandingLayout>
  );
}
