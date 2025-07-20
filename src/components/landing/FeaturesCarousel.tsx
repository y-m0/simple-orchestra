
import { 
  Workflow, 
  Users, 
  Activity, 
  ClipboardCheck, 
  Zap 
} from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function FeaturesCarousel() {
  const features = [
    {
      title: "Visual Workflow Builder",
      description: "Drag-and-drop interface to create complex automation workflows without code",
      icon: <Workflow className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Human-AI Hybrid Approvals",
      description: "Seamlessly blend AI operations with human approval checkpoints",
      icon: <ClipboardCheck className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Agent Directory",
      description: "Manage access controls and permissions for human and AI agents",
      icon: <Users className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Activity Logging",
      description: "Comprehensive audit trail for all actions in your workflows",
      icon: <Activity className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Real-Time LLM Orchestration",
      description: "Coordinate multiple AI models in sophisticated processes",
      icon: <Zap className="h-8 w-8 text-purple-500" />
    }
  ];

  return (
    <section className="py-20 px-4 relative" id="features">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/5 via-background to-purple-950/5 z-0"></div>
      
      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Powerful Features
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Everything you need to build, deploy, and manage intelligent workflows that combine human expertise with AI capabilities.
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {features.map((feature, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="border border-purple-500/20 h-full bg-background/60 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]">
                  <CardContent className="flex flex-col items-center p-6 text-center h-full">
                    <div className="mb-5 p-3 rounded-full bg-purple-500/10">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-purple-400">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </motion.div>
    </section>
  );
}
