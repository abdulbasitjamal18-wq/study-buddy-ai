import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, BookOpen, Clock, Target, Award, Loader2, Plus } from "lucide-react";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProgressData {
  id: string;
  subject: string;
  topic: string | null;
  completion_percentage: number | null;
  study_hours: number | null;
  last_studied_at: string | null;
}

const Progress = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newProgress, setNewProgress] = useState({
    subject: "",
    topic: "",
    completion_percentage: "",
    study_hours: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch progress data
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .order("subject", { ascending: true });

        if (error) throw error;
        setProgressData(data || []);
      } catch (error) {
        console.error("Error fetching progress:", error);
        toast({
          title: "Error",
          description: "Failed to load progress data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user, toast]);

  const handleAddProgress = async () => {
    if (!newProgress.subject) {
      toast({
        title: "Missing information",
        description: "Please enter at least a subject.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to add progress.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from("progress")
        .insert({
          subject: newProgress.subject,
          topic: newProgress.topic || null,
          completion_percentage: parseInt(newProgress.completion_percentage) || 0,
          study_hours: parseFloat(newProgress.study_hours) || 0,
          last_studied_at: new Date().toISOString(),
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setProgressData((prev) => [...prev, data]);
      setNewProgress({
        subject: "",
        topic: "",
        completion_percentage: "",
        study_hours: "",
      });
      setIsDialogOpen(false);
      toast({
        title: "Progress added!",
        description: "Your study progress has been recorded.",
      });
    } catch (error) {
      console.error("Error adding progress:", error);
      toast({
        title: "Error",
        description: "Failed to add progress.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateProgress = async (id: string, newPercentage: number) => {
    try {
      const { error } = await supabase
        .from("progress")
        .update({ 
          completion_percentage: newPercentage,
          last_studied_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setProgressData((prev) =>
        prev.map((p) => (p.id === id ? { ...p, completion_percentage: newPercentage } : p))
      );
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress.",
        variant: "destructive",
      });
    }
  };

  // Group progress by subject
  const subjects = progressData.reduce((acc, item) => {
    const existing = acc.find((s) => s.name === item.subject);
    if (existing) {
      existing.topics.push({
        name: item.topic || "General",
        completed: item.completion_percentage || 0,
        id: item.id,
      });
      existing.totalProgress = Math.round(
        existing.topics.reduce((sum, t) => sum + t.completed, 0) / existing.topics.length
      );
      existing.studyHours += item.study_hours || 0;
    } else {
      acc.push({
        name: item.subject,
        topics: [{ name: item.topic || "General", completed: item.completion_percentage || 0, id: item.id }],
        totalProgress: item.completion_percentage || 0,
        studyHours: item.study_hours || 0,
        color: getSubjectColor(acc.length),
      });
    }
    return acc;
  }, [] as { name: string; topics: { name: string; completed: number; id: string }[]; totalProgress: number; studyHours: number; color: string }[]);

  function getSubjectColor(index: number) {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"];
    return colors[index % colors.length];
  }

  const totalHours = progressData.reduce((sum, p) => sum + (p.study_hours || 0), 0);
  const averageProgress = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + s.totalProgress, 0) / subjects.length)
    : 0;
  const topicsCount = progressData.length;

  // Mock weekly activity (would need a separate table for real tracking)
  const weeklyActivity = [
    { day: "Mon", hours: Math.random() * 5 },
    { day: "Tue", hours: Math.random() * 5 },
    { day: "Wed", hours: Math.random() * 5 },
    { day: "Thu", hours: Math.random() * 5 },
    { day: "Fri", hours: Math.random() * 5 },
    { day: "Sat", hours: Math.random() * 5 },
    { day: "Sun", hours: Math.random() * 5 },
  ];
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours), 1);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Progress Tracking - StudyAI</title>
        </Helmet>
        <DashboardHeader title="Progress Tracking" subtitle="Monitor your academic journey" />
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Progress Tracking - StudyAI</title>
      </Helmet>
      <DashboardHeader title="Progress Tracking" subtitle="Monitor your academic journey" />

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-muted-foreground">Overall Progress</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{averageProgress}%</div>
          </div>

          <div className="p-5 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-muted-foreground">Total Hours</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalHours.toFixed(1)} hrs</div>
          </div>

          <div className="p-5 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-muted-foreground">Topics Tracked</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{topicsCount}</div>
          </div>

          <div className="p-5 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-muted-foreground">Subjects</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{subjects.length}</div>
          </div>
        </div>

        {/* Add Progress Button */}
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4" />
                Add Progress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Track New Progress</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Computer Science"
                    value={newProgress.subject}
                    onChange={(e) =>
                      setNewProgress((prev) => ({ ...prev, subject: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic (optional)</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Data Structures"
                    value={newProgress.topic}
                    onChange={(e) =>
                      setNewProgress((prev) => ({ ...prev, topic: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="completion">Completion %</Label>
                    <Input
                      id="completion"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0-100"
                      value={newProgress.completion_percentage}
                      onChange={(e) =>
                        setNewProgress((prev) => ({ ...prev, completion_percentage: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">Study Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min={0}
                      step={0.5}
                      placeholder="e.g., 2.5"
                      value={newProgress.study_hours}
                      onChange={(e) =>
                        setNewProgress((prev) => ({ ...prev, study_hours: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddProgress} className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Progress"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="p-6 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Weekly Activity</h2>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">{day.hours.toFixed(1)}h</span>
                    <div
                      className="w-full max-w-[40px] gradient-accent rounded-t-lg transition-all duration-500"
                      style={{ height: `${(day.hours / maxHours) * 100}px` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Progress */}
          <div className="p-6 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Subject Progress</h2>
            </div>
            {subjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No progress tracked yet. Add your first subject!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {subjects.map((subject) => (
                  <div key={subject.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                        <span className="text-sm font-medium text-foreground">{subject.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{subject.totalProgress}%</span>
                    </div>
                    <ProgressBar value={subject.totalProgress} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Topic Progress */}
        {subjects.length > 0 && (
          <div className="p-6 rounded-xl glass-card">
            <h2 className="font-display text-lg font-semibold text-foreground mb-6">Topic Breakdown</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                    <h3 className="font-semibold text-foreground">{subject.name}</h3>
                  </div>
                  <div className="space-y-3">
                    {subject.topics.map((topic) => (
                      <div key={topic.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-foreground">{topic.name}</span>
                          <span
                            className={`text-xs font-medium ${
                              topic.completed === 100
                                ? "text-green-600"
                                : topic.completed >= 50
                                ? "text-orange-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {topic.completed}%
                          </span>
                        </div>
                        <ProgressBar value={topic.completed} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Progress;