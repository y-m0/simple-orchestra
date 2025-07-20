
import { motion } from "framer-motion";
import { Check, Pencil, Users, Database, Activity } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Pencil className="h-6 w-6 text-purple-400" />,
      title: "Design Workflows",
      description: "Create workflows with our visual builder - no coding required",
      color: "from-purple-400/20 to-purple-500/20"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Assign Agents",
      description: "Add human and AI agents to handle tasks and decisions",
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      icon: <Database className="h-6 w-6 text-purple-400" />,
      title: "Integrate Data",
      description: "Connect your data sources and services via APIs",
      color: "from-purple-600/20 to-purple-700/20"
    },
    {
      icon: <Activity className="h-6 w-6 text-purple-400" />,
      title: "Monitor & Optimize",
      description: "Track performance and optimize your workflows continuously",
      color: "from-purple-700/20 to-purple-800/20"
    },
  ];

  return (
    <section className="py-20 px-4" id="how-it-works">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Get started in just four simple steps and transform your workflow automation
        </p>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/20 to-purple-700/20 transform -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-16 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:order-first' : 'md:order-last'}`}>
                  <motion.div 
                    className="bg-card border border-purple-500/20 rounded-xl p-6 shadow-[0_0_15px_rgba(155,135,245,0.15)] hover:shadow-[0_0_25px_rgba(155,135,245,0.25)] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`h-2 bg-gradient-to-r ${step.color} mb-4 rounded-full`}></div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold text-purple-400">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                </div>
                
                {/* Timeline Point */}
                <div className="relative hidden md:block">
                  <motion.div 
                    className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center z-10 relative border-4 border-background"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, delay: index * 0.2 }}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </motion.div>
                </div>
                
                {/* Empty div for spacing on alternate sides */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-last' : 'md:order-first'}`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
