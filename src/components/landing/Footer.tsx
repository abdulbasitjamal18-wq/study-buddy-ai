import { GraduationCap, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const productLinks = [
    { label: "Features", sectionId: "features" },
    { label: "How It Works", sectionId: "how-it-works" },
    { label: "Pricing", sectionId: "cta" },
  ];

  const toolsLinks = [
    { label: "AI Notes Generator", to: "/dashboard/notes" },
    { label: "Doubt Solver", to: "/dashboard/doubts" },
    { label: "Study Planner", to: "/dashboard/planner" },
    { label: "Assignment Tracker", to: "/dashboard/assignments" },
  ];

  const companyLinks = [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                StudyAI
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              The AI-powered academic assistant designed to help university students study smarter, not harder. Generate notes, solve doubts, and track your progress.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@studyai.com"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.sectionId}>
                  <button
                    onClick={() => scrollToSection(link.sectionId)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Tools</h3>
            <ul className="space-y-3">
              {toolsLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} StudyAI. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for students everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;