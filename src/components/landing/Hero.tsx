import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-foreground mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Learning Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your Personal
            <span className="block mt-2 text-gradient">Academic Assistant</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Plan your studies, generate comprehensive notes, solve doubts instantly, and track your academic progress — all powered by advanced AI technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild variant="hero" size="xl">
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-foreground">10k+</div>
              <div className="text-sm text-primary-foreground/60">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-foreground">50k+</div>
              <div className="text-sm text-primary-foreground/60">Notes Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-foreground">95%</div>
              <div className="text-sm text-primary-foreground/60">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Floating icon */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="p-4 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30">
            <GraduationCap className="w-8 h-8 text-secondary-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
