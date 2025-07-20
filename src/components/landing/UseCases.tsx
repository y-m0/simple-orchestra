
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, MessageSquareQuote, Rocket } from "lucide-react";

export function UseCases() {
  const useCases = [
    {
      title: "Automate Expense Approvals in Minutes",
      description: "Streamline expense reports with intelligent routing and automatic approval for low-risk transactions",
      icon: <ClipboardList className="h-6 w-6 text-purple-400" />,
      color: "from-purple-400/20 to-purple-500/20"
    },
    {
      title: "Route Support Tickets to the Right Team Instantly",
      description: "LLM-powered classification directs customer issues to the best agent for resolution",
      icon: <MessageSquareQuote className="h-6 w-6 text-purple-400" />,
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      title: "Launch AI-Powered Social Campaigns",
      description: "Combine human creativity with AI content generation for powerful marketing workflows",
      icon: <Rocket className="h-6 w-6 text-purple-400" />,
      color: "from-purple-600/20 to-purple-700/20"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-950/5 via-background to-background" id="use-cases">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Popular Use Cases
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          See how organizations are leveraging Orchestra to transform their operations with AI-powered workflows.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-purple-500/20 bg-background/60 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.2)]"
            >
              <div className={`h-2 bg-gradient-to-r ${useCase.color}`}></div>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 rounded-full bg-purple-500/10 w-fit">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-400">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
