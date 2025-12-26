import { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, Sparkles, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface StudyPlanDB {
  id: string;
  title: string;
  subject: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  created_at: string;
}

interface StudyPlanDay {
  day: string;
  sessions: { time: string; topic: string; duration: string }[];
}

const StudyPlanner = () => {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlanDay[] | null>(null);
  const [savedPlans, setSavedPlans] = useState<StudyPlanDB[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlanDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch saved study plans
  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("study_plans")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setSavedPlans(data || []);
      } catch (error) {
        console.error("Error fetching study plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [user]);

  const handleGenerate = async () => {
    if (!subject || !topics || !examDate || !studyHours) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to generate a study plan.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create a study plan.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Generate mock plan
    const mockPlan: StudyPlanDay[] = [
      {
        day: "Monday",
        sessions: [
          { time: "9:00 AM - 11:00 AM", topic: topics.split(",")[0]?.trim() || "Introduction", duration: "2 hours" },
          { time: "2:00 PM - 4:00 PM", topic: "Practice Problems", duration: "2 hours" },
        ],
      },
      {
        day: "Tuesday",
        sessions: [
          { time: "9:00 AM - 11:00 AM", topic: topics.split(",")[1]?.trim() || "Core Concepts", duration: "2 hours" },
          { time: "3:00 PM - 5:00 PM", topic: "Review Session", duration: "2 hours" },
        ],
      },
      {
        day: "Wednesday",
        sessions: [
          { time: "10:00 AM - 12:00 PM", topic: topics.split(",")[2]?.trim() || "Advanced Topics", duration: "2 hours" },
        ],
      },
      {
        day: "Thursday",
        sessions: [
          { time: "9:00 AM - 11:00 AM", topic: "Problem Solving", duration: "2 hours" },
          { time: "2:00 PM - 4:00 PM", topic: "Mock Test", duration: "2 hours" },
        ],
      },
      {
        day: "Friday",
        sessions: [
          { time: "10:00 AM - 12:00 PM", topic: "Revision", duration: "2 hours" },
          { time: "3:00 PM - 4:00 PM", topic: "Doubt Clearing", duration: "1 hour" },
        ],
      },
    ];

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from("study_plans")
        .insert({
          title: `${subject} Study Plan`,
          subject: subject,
          description: JSON.stringify(mockPlan),
          start_date: new Date().toISOString().split("T")[0],
          end_date: examDate,
          status: "active",
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedPlan(mockPlan);
      setSavedPlans((prev) => [data, ...prev]);
      setSelectedPlan(data);
      
      toast({
        title: "Study plan generated!",
        description: "Your personalized weekly study plan is ready and saved.",
      });
    } catch (error) {
      console.error("Error saving study plan:", error);
      toast({
        title: "Error",
        description: "Failed to save study plan.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPlan = (plan: StudyPlanDB) => {
    setSelectedPlan(plan);
    try {
      const parsed = JSON.parse(plan.description || "[]");
      setGeneratedPlan(parsed);
    } catch {
      setGeneratedPlan(null);
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from("study_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedPlans((prev) => prev.filter((p) => p.id !== id));
      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
        setGeneratedPlan(null);
      }
      
      toast({
        title: "Plan deleted",
        description: "The study plan has been removed.",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete study plan.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Study Planner - StudyAI</title>
      </Helmet>
      <DashboardHeader title="AI Study Planner" subtitle="Create a personalized study schedule" />

      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Saved Plans Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-4 rounded-xl glass-card">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Saved Plans</h3>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : savedPlans.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No saved plans yet</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {savedPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                        selectedPlan?.id === plan.id
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => loadPlan(plan)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{plan.title}</p>
                          <p className="text-xs text-muted-foreground">{plan.subject}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlan(plan.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Form */}
          <div className="lg:col-span-1 p-6 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Calendar className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Plan Your Studies</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Name</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="subject"
                    placeholder="e.g., Data Structures & Algorithms"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics">Syllabus Topics</Label>
                <Textarea
                  id="topics"
                  placeholder="Enter topics separated by commas (e.g., Arrays, Linked Lists, Trees, Graphs)"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studyHours">Daily Study Hours</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="studyHours"
                    type="number"
                    placeholder="e.g., 4"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                    className="pl-10"
                    min={1}
                    max={12}
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full"
                variant="hero"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Study Plan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Plan */}
          <div className="lg:col-span-2 p-6 rounded-xl glass-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {selectedPlan?.title || "Your Weekly Plan"}
                  </h2>
                  <p className="text-sm text-muted-foreground">AI-optimized schedule</p>
                </div>
              </div>
            </div>

            {generatedPlan ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {generatedPlan.map((day) => (
                  <div key={day.day} className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-foreground mb-3">{day.day}</h3>
                    <div className="space-y-2">
                      {day.sessions.map((session, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-md bg-card"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{session.topic}</div>
                            <div className="text-xs text-muted-foreground">{session.time}</div>
                          </div>
                          <span className="text-xs text-secondary font-medium">{session.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">No plan generated yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Fill in your study details and click generate to create your personalized plan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyPlanner;