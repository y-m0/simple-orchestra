
import { motion } from "framer-motion";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

export function Testimonials() {
  // Add workflow-specific testimonials focused on the email sorting use case
  const testimonials = [
    {
      quote: "Cut our email handling time by 30% with Orchestra! The email-to-invoice automation changed how our finance department operates.",
      author: "Alex Morgan",
      role: "Operations Manager",
      company: "TechSolutions Inc.",
      avatar: "https://i.pravatar.cc/100?img=1",
      rating: 5
    },
    {
      quote: "Automation so intuitive, even non-tech teams started building workflows. Our HR department created their own document processing system in days.",
      author: "Jamie Chen",
      role: "Product Lead",
      company: "InnovateAI",
      avatar: "https://i.pravatar.cc/100?img=2",
      rating: 4.5
    },
    {
      quote: "Email classification workflows saved us countless hours of manual sorting. Now our team focuses on analysis instead of inbox management.",
      author: "Taylor Williams",
      role: "Finance Director",
      company: "FinSecure",
      avatar: "https://i.pravatar.cc/100?img=3",
      rating: 5
    },
    {
      quote: "Our approval workflows used to take days. With Orchestra, we've reduced that to hours while improving compliance and documentation.",
      author: "Jordan Smith",
      role: "Digital Transformation Lead",
      company: "Global Services Ltd.",
      avatar: "https://i.pravatar.cc/100?img=4",
      rating: 5
    }
  ];
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <section className="py-20 px-4" id="testimonials">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Trusted by teams looking to automate smarter
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Join hundreds of teams using Orchestra to revolutionize their workflow automation.
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-purple-500/20 bg-background/60 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,135,245,0.15)]">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <blockquote className="text-muted-foreground italic mb-4 flex-1">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-purple-400">{testimonial.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
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
