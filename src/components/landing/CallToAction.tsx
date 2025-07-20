
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Mail, Database, ArrowRight, ChevronRight } from "lucide-react";

export function CallToAction() {
  const features = [
    "Email workflow automation",
    "Human-AI collaboration tools",
    "Approval management",
    "Activity monitoring",
    "Custom sorting conditions",
    "Secure data connections"
  ];

  const emailWorkflowUseCase = [
    "Automatic email classification",
    "Intelligent invoice processing",
    "Document storage & organization",
    "Custom team notifications",
    "History tracking & analytics"
  ];

  return (
    <section className="py-20 px-4 relative" id="get-started">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/5 to-background z-0"></div>
      
      <motion.div 
        className="max-w-5xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="bg-card border border-purple-500/30 rounded-xl p-8 md:p-12 shadow-[0_0_30px_rgba(155,135,245,0.15)]">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Ready to Automate Your Email Workflows?
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
            Get started with Orchestra today and experience the power of intelligent workflow automation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 text-purple-400 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Workflow Use Cases
              </h3>
              <ul className="space-y-2">
                {emailWorkflowUseCase.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-purple-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <div className="p-6 bg-purple-500/5 rounded-lg border border-purple-500/20 mb-4">
                <h3 className="font-bold text-xl mb-4 text-purple-400 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Platform Features
                </h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-purple-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="p-6 bg-purple-500/5 rounded-lg border border-purple-500/20 mb-6 max-w-xl mx-auto">
              <p className="text-sm mb-2"><span className="font-bold">Free tier includes:</span> 5 workflows, 3 integrations, and 1,000 executions per month</p>
              <p className="text-xs text-muted-foreground">No credit card required to start</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 shadow-xl shadow-purple-500/50 brightness-125 saturate-200 hover:brightness-150 transition-all duration-300 group"
              >
                <Link to="/onboarding">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>Trusted by startups and enterprises alike</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
