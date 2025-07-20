
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Demo", href: "#demo" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add smooth scrolling behavior
  useEffect(() => {
    // Function to handle smooth scrolling when clicking on anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const href = target.getAttribute('href') as string;
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
          
          // Update URL without reload (optional)
          window.history.pushState({}, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header 
        className={`w-full p-4 flex justify-between items-center fixed top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-border/30 shadow-sm" 
            : "bg-transparent"
        }`}
      >
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Orchestra
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              asChild 
              className="text-sm hover:bg-purple-500/10"
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button 
              asChild 
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/20"
            >
              <Link to="/onboarding">Create Account</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 pt-20 p-4 flex flex-col md:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col items-center gap-6 text-lg">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                className="text-foreground hover:text-purple-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t border-border/50 w-full my-4"></div>
            <Button variant="ghost" asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900" onClick={() => setMobileMenuOpen(false)}>
              <Link to="/onboarding">Create Account</Link>
            </Button>
          </nav>
        </motion.div>
      )}
      
      <main className="pt-16">
        {children}
      </main>
      
      <footer className="py-12 px-4 border-t border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4 block">
                Orchestra
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Building the future of intelligent workflow automation for teams of all sizes
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-purple-400">Product</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
                <a href="#use-cases" className="hover:text-purple-400 transition-colors">Use Cases</a>
                <a href="#demo" className="hover:text-purple-400 transition-colors">Demo</a>
                <a href="#get-started" className="hover:text-purple-400 transition-colors">Pricing</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-purple-400">Resources</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-purple-400 transition-colors">Documentation</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Tutorials</a>
                <a href="#" className="hover:text-purple-400 transition-colors">API Reference</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Community</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-purple-400">Company</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-purple-400 transition-colors">About Us</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Careers</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Blog</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Orchestra. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/onboarding">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
