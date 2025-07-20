
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, Search, ForwardIcon, Database, CheckCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";

export function WorkflowHeroDemo() {
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const [workflowCompleted, setWorkflowCompleted] = useState(false);
  
  // Use intersection observer to trigger animation when component is in view
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const nodes = [
    { id: "email", icon: Mail, label: "New Email Received", x: "25%", y: "30%" },
    { id: "condition", icon: Search, label: "Check if Subject Contains 'Invoice'", x: "50%", y: "20%" },
    { id: "forward", icon: ForwardIcon, label: "Forward Email to Finance Team", x: "75%", y: "30%" },
    { id: "database", icon: Database, label: "Log Email Details to Database", x: "50%", y: "70%" },
  ];

  // Connections between nodes (source -> target)
  const connections = [
    { from: 0, to: 1 }, // Email -> Condition
    { from: 1, to: 2 }, // Condition -> Forward
    { from: 1, to: 3 }, // Condition -> Database
  ];

  useEffect(() => {
    // Change from number to NodeJS.Timeout for proper type definition
    let timeout: NodeJS.Timeout | undefined;
    
    if (inView) {
      // Reset workflow state when coming into view
      setActiveNodeIndex(-1);
      setWorkflowCompleted(false);
      
      // Start workflow animation sequence after a short delay
      timeout = setTimeout(() => {
        // Animate through each node
        const animateNodes = (index: number) => {
          if (index < nodes.length) {
            setActiveNodeIndex(index);
            setTimeout(() => animateNodes(index + 1), 1000);
          } else {
            // Mark workflow as completed after all nodes are highlighted
            setTimeout(() => setWorkflowCompleted(true), 500);
          }
        };
        
        animateNodes(0);
      }, 800);
    } else {
      // Reset when out of view
      if (timeout) clearTimeout(timeout);
      setActiveNodeIndex(-1);
      setWorkflowCompleted(false);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [inView, nodes.length]);

  return (
    <div ref={ref} className="relative w-full aspect-[16/9] max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 rounded-3xl border border-purple-500/20">
        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute"
            style={{ left: node.x, top: node.y }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: activeNodeIndex >= index ? 1 : 0.3, 
              scale: activeNodeIndex >= index ? 1 : 0.8,
              y: activeNodeIndex >= index ? 0 : 20,
              filter: activeNodeIndex === index ? "brightness(1.5)" : "brightness(1)"
            }}
            transition={{ 
              duration: 0.5,
              delay: inView ? index * 0.2 : 0
            }}
          >
            <motion.div
              className={`relative p-4 rounded-2xl backdrop-blur-sm border
                ${activeNodeIndex >= index ? 'bg-card shadow-lg shadow-purple-500/20 border-purple-500/30' : 'bg-card/30 border-purple-500/10'}`}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: activeNodeIndex === index 
                  ? "0 0 20px rgba(168, 85, 247, 0.4)"
                  : "0 0 0px rgba(168, 85, 247, 0)"
              }}
            >
              <node.icon className={`w-8 h-8 ${
                activeNodeIndex === index ? 'text-purple-400' : 'text-muted-foreground'
              }`} />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-muted-foreground whitespace-nowrap max-w-[200px] text-center">
                {node.label}
              </span>
            </motion.div>
          </motion.div>
        ))}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          
          {connections.map((connection, index) => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            
            return (
              <motion.path
                key={`${fromNode.id}-${toNode.id}`}
                d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                stroke="url(#purpleGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: activeNodeIndex >= connection.to ? 1 : 0, 
                  opacity: activeNodeIndex >= connection.from ? 1 : 0,
                  strokeWidth: activeNodeIndex === connection.to ? 3 : 2
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </svg>

        {/* Workflow Completion Animation */}
        <AnimatePresence>
          {workflowCompleted && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-green-500/30 shadow-lg shadow-green-500/20 flex items-center gap-2"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <CheckCircle className="text-green-500 w-6 h-6" />
                <span className="font-medium">Workflow Completed Successfully</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background Effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 rounded-3xl"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </div>
  );
}
