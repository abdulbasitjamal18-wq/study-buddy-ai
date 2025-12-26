import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome to StudyAI. Let's get started!",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - StudyAI</title>
        <meta name="description" content="Create your free StudyAI account and start studying smarter with AI." />
      </Helmet>
      <div className="min-h-screen flex">
        {/* Left Panel - Decorative */}
        <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30 flex items-center justify-center animate-float">
              <GraduationCap className="w-12 h-12 text-secondary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
              Join Thousands of Students
            </h2>
            <p className="text-primary-foreground/80">
              Transform your academic experience with AI-powered study tools designed for university success.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Back Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-semibold text-foreground">
                StudyAI
              </span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Create your account
              </h1>
              <p className="text-muted-foreground">
                Start your journey to academic excellence
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <Button type="submit" variant="hero" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Sign in link */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-secondary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
