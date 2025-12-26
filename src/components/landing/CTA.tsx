import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30 mb-8">
            <Sparkles className="w-8 h-8 text-secondary-foreground" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your
            <span className="block text-gradient">Academic Journey?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of students who are already studying smarter with AI-powered assistance. Start your free account today.
          </p>

          {/* CTA Button */}
          <Button asChild variant="hero" size="xl">
            <Link to="/signup">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>

          {/* Trust badge */}
          <p className="mt-6 text-sm text-primary-foreground/60">
            No credit card required • Free forever for basic features
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
