import { useState } from "react";
import { CheckSquare, Plus, Calendar, Clock, Trash2, Check, X } from "lucide-react";
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

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  type: "assignment" | "quiz" | "exam";
  completed: boolean;
}

const initialAssignments: Assignment[] = [
  {
    id: "1",
    title: "Data Structures Lab Report",
    subject: "Computer Science",
    dueDate: "2024-12-28",
    priority: "high",
    type: "assignment",
    completed: false,
  },
  {
    id: "2",
    title: "Physics Mid-term Exam",
    subject: "Physics",
    dueDate: "2024-12-30",
    priority: "high",
    type: "exam",
    completed: false,
  },
  {
    id: "3",
    title: "Mathematics Quiz - Calculus",
    subject: "Mathematics",
    dueDate: "2024-12-27",
    priority: "medium",
    type: "quiz",
    completed: false,
  },
  {
    id: "4",
    title: "Literature Essay",
    subject: "English",
    dueDate: "2025-01-05",
    priority: "low",
    type: "assignment",
    completed: true,
  },
];

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
    type: "assignment" as "assignment" | "quiz" | "exam",
  });
  const { toast } = useToast();

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      completed: false,
    };

    setAssignments((prev) => [...prev, assignment]);
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
  };

  const toggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    toast({
      title: "Assignment deleted",
      description: "The task has been removed.",
    });
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const urgentCount = assignments.filter((a) => !a.completed && a.priority === "high").length;
  const upcomingCount = assignments.filter((a) => !a.completed && a.priority !== "high").length;
  const completedCount = assignments.filter((a) => a.completed).length;

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
                      onValueChange={(value: "low" | "medium" | "high") =>
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
                    onValueChange={(value: "assignment" | "quiz" | "exam") =>
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
                <Button onClick={handleAddAssignment} className="w-full">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assignment List */}
        <div className="space-y-3">
          {sortedAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl glass-card transition-all duration-200",
                assignment.completed && "opacity-60"
              )}
            >
              <button
                onClick={() => toggleComplete(assignment.id)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  assignment.completed
                    ? "bg-green-500 border-green-500"
                    : "border-muted-foreground hover:border-primary"
                )}
              >
                {assignment.completed && <Check className="w-4 h-4 text-primary-foreground" />}
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
                      assignment.completed && "line-through"
                    )}
                  >
                    {assignment.title}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      assignment.type === "exam"
                        ? "bg-destructive/10 text-destructive"
                        : assignment.type === "quiz"
                        ? "bg-orange-500/10 text-orange-600"
                        : "bg-blue-500/10 text-blue-600"
                    )}
                  >
                    {assignment.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{assignment.subject}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
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
          ))}
        </div>
      </div>
    </>
  );
};

export default Assignments;
