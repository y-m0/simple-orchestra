
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AnimatedWorkflow } from "./AnimatedWorkflow";

export function DemoPreview() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-950/5 via-background to-purple-950/5" id="demo">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          See It In Action
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Experience the power of Orchestra with our interactive demo. Build workflows, trigger LLMs, and manage approvals.
        </p>

        <div className="relative max-w-5xl mx-auto">
          <AnimatedWorkflow />
          
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center max-w-md px-6">
              <motion.h3 
                className="text-xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Build Your First Workflow
              </motion.h3>
              <motion.p 
                className="text-white/80 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Create, test, and deploy powerful workflows in minutes without coding
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-4"
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900">
                  <Link to="/onboarding">Get Started</Link>
                </Button>
                
                <div className="flex justify-center">
                  <Link to="/login" className="text-purple-300 hover:text-purple-200 text-sm underline">
                    Already have an account? Login
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
