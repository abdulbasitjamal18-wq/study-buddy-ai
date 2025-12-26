import { UserPlus, Settings, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Your Account",
    description: "Sign up in seconds with your email. Your personal academic workspace awaits.",
  },
  {
    icon: Settings,
    number: "02",
    title: "Set Your Goals",
    description: "Add your subjects, syllabus topics, and exam dates. Tell us your available study hours.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Start Learning Smarter",
    description: "Get AI-generated study plans, instant notes, and academic support whenever you need it.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground text-lg">
            Three simple steps to transform your academic experience.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-border" />
              )}

              {/* Icon container */}
              <div className="relative z-10 w-32 h-32 mx-auto mb-6 rounded-full bg-card shadow-medium flex items-center justify-center">
                <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>

              {/* Step number */}
              <span className="inline-block text-secondary font-bold text-sm mb-2">
                STEP {step.number}
              </span>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
