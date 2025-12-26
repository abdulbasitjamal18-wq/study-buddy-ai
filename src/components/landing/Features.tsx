import { Calendar, FileText, MessageCircle, CheckSquare, BarChart3, Sparkles } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "AI Study Planner",
    description: "Generate personalized weekly study plans based on your syllabus, exam dates, and available hours. Stay organized and on track.",
  },
  {
    icon: FileText,
    title: "Notes Generator",
    description: "Create comprehensive, exam-oriented notes on any topic instantly. Well-structured with headings and bullet points.",
  },
  {
    icon: MessageCircle,
    title: "Doubt Solver",
    description: "Get instant, clear explanations for any academic question. Includes examples and step-by-step solutions.",
  },
  {
    icon: CheckSquare,
    title: "Deadline Tracker",
    description: "Never miss an assignment or exam. Priority-based task management keeps you focused on what matters most.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visualize your academic journey with progress indicators. Track completed topics and stay motivated.",
  },
  {
    icon: Sparkles,
    title: "Smart Dashboard",
    description: "All your academic tools in one place. Quick access to study plans, deadlines, and AI assistants.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful AI tools designed specifically for university students to enhance productivity and academic success.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 lg:p-8 rounded-2xl glass-card hover-lift cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow duration-300">
                <feature.icon className="w-7 h-7 text-secondary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
