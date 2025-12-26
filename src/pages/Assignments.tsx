import { useState, useEffect } from "react";
import { CheckSquare, Plus, Calendar, Clock, Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Assignment {
  id: string;
  title: string;
  subject: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
  description: string | null;
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject: "",
    dueDate: "",
    priority: "medium",
    type: "assignment",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch assignments from Supabase
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("assignments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAssignments(data || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast({
          title: "Error",
          description: "Failed to load assignments.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [user, toast]);

  const handleAddAssignment = async () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to add assignments.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from("assignments")
        .insert({
          title: newAssignment.title,
          subject: newAssignment.subject,
          due_date: newAssignment.dueDate,
          priority: newAssignment.priority,
          description: newAssignment.type,
          status: "pending",
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setAssignments((prev) => [data, ...prev]);
      setNewAssignment({
        title: "",
        subject: "",
        dueDate: "",
        priority: "medium",
        type: "assignment",
      });
      setIsDialogOpen(false);
      toast({
        title: "Assignment added!",
        description: "Your new task has been added to the tracker.",
      });
    } catch (error) {
      console.error("Error adding assignment:", error);
      toast({
        title: "Error",
        description: "Failed to add assignment.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleComplete = async (id: string) => {
    const assignment = assignments.find((a) => a.id === id);
    if (!assignment) return;

    const newStatus = assignment.status === "completed" ? "pending" : "completed";

    try {
      const { error } = await supabase
        .from("assignments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to update assignment.",
        variant: "destructive",
      });
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("assignments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAssignments((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Assignment deleted",
        description: "The task has been removed.",
      });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to delete assignment.",
        variant: "destructive",
      });
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    const aCompleted = a.status === "completed";
    const bCompleted = b.status === "completed";
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return (priorityOrder[a.priority || "medium"] || 1) - (priorityOrder[b.priority || "medium"] || 1);
  });

  const urgentCount = assignments.filter((a) => a.status !== "completed" && a.priority === "high").length;
  const upcomingCount = assignments.filter((a) => a.status !== "completed" && a.priority !== "high").length;
  const completedCount = assignments.filter((a) => a.status === "completed").length;

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Assignments - StudyAI</title>
        </Helmet>
        <DashboardHeader title="Assignment Tracker" subtitle="Manage your deadlines and tasks" />
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Assignments - StudyAI</title>
      </Helmet>
      <DashboardHeader title="Assignment Tracker" subtitle="Manage your deadlines and tasks" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div className="text-2xl font-bold text-destructive">{urgentCount}</div>
            <div className="text-sm text-muted-foreground">Urgent</div>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-600">{upcomingCount}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground">All Tasks</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Physics Lab Report"
                    value={newAssignment.title}
                    onChange={(e) =>
                      setNewAssignment((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Physics"
                    value={newAssignment.subject}
                    onChange={(e) =>
                      setNewAssignment((prev) => ({ ...prev, subject: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newAssignment.priority}
                      onValueChange={(value) =>
                        setNewAssignment((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newAssignment.type}
                    onValueChange={(value) =>
                      setNewAssignment((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddAssignment} className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Task"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assignment List */}
        <div className="space-y-3">
          {sortedAssignments.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-1">No assignments yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your first task to get started
              </p>
            </div>
          ) : (
            sortedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl glass-card transition-all duration-200",
                  assignment.status === "completed" && "opacity-60"
                )}
              >
                <button
                  onClick={() => toggleComplete(assignment.id)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    assignment.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : "border-muted-foreground hover:border-primary"
                  )}
                >
                  {assignment.status === "completed" && <Check className="w-4 h-4 text-primary-foreground" />}
                </button>

                <div
                  className={cn(
                    "w-1 h-12 rounded-full",
                    assignment.priority === "high"
                      ? "bg-destructive"
                      : assignment.priority === "medium"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  )}
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        "font-medium text-foreground",
                        assignment.status === "completed" && "line-through"
                      )}
                    >
                      {assignment.title}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        assignment.description === "exam"
                          ? "bg-destructive/10 text-destructive"
                          : assignment.description === "quiz"
                          ? "bg-orange-500/10 text-orange-600"
                          : "bg-blue-500/10 text-blue-600"
                      )}
                    >
                      {assignment.description || "assignment"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {assignment.due_date
                    ? new Date(assignment.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "No date"}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteAssignment(assignment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Assignments;