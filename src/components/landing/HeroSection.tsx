
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { WorkflowHeroDemo } from "./demo/WorkflowHeroDemo";

export function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-purple-950/10 to-background z-0"></div>
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-3xl -top-64 -right-64"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-3xl -bottom-64 -left-64"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="max-w-7xl w-full mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent tracking-tight mb-6"
            variants={item}
          >
            Orchestra
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-4"
            variants={item}
          >
            Intelligent Workflow Automation for Humans & AI
          </motion.p>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto mb-8"
            variants={item}
          >
            Build, deploy, and manage hybrid human-AI workflows with a powerful visual orchestration platform.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            variants={item}
          >
            <Button 
              size="lg" 
              asChild 
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 group shadow-xl shadow-purple-500/30"
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
              className="group"
            >
              <a href="#demo" className="flex items-center">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </a>
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex justify-center items-center gap-2 text-sm text-muted-foreground"
            variants={item}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[10px]">
                  {i}
                </div>
              ))}
            </div>
            <span>Join 500+ teams already using Orchestra</span>
          </motion.div>
        </motion.div>

        {/* Invoice Workflow Demo Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          id="demo"
        >
          <div className="text-center mb-8">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Let automation handle the busywork
            </motion.h2>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Forward, log, and track — without lifting a finger
            </motion.p>
          </div>
          
          {/* Workflow Demo */}
          <WorkflowHeroDemo />
          
          {/* CTA after demo */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6">Ready to automate?</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" variant="default">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-lg shadow-purple-500/20">
                <Link to="/onboarding">Sign Up</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
