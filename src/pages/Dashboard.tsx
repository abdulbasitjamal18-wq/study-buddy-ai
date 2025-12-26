import { Calendar, FileText, MessageCircle, CheckSquare, ArrowRight, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const quickActions = [
  {
    icon: Calendar,
    label: "Create Study Plan",
    description: "AI-powered weekly planner",
    path: "/dashboard/planner",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: FileText,
    label: "Generate Notes",
    description: "Instant topic summaries",
    path: "/dashboard/notes",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: MessageCircle,
    label: "Ask a Question",
    description: "Get instant explanations",
    path: "/dashboard/doubts",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: CheckSquare,
    label: "Add Assignment",
    description: "Track your deadlines",
    path: "/dashboard/assignments",
    color: "bg-orange-500/10 text-orange-600",
  },
];

const upcomingDeadlines = [
  { title: "Data Structures Assignment", subject: "Computer Science", date: "Tomorrow", priority: "high" },
  { title: "Physics Lab Report", subject: "Physics", date: "In 3 days", priority: "medium" },
  { title: "Literature Essay", subject: "English", date: "In 5 days", priority: "low" },
];

const studyProgress = [
  { subject: "Mathematics", completed: 75 },
  { subject: "Computer Science", completed: 60 },
  { subject: "Physics", completed: 45 },
];

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - StudyAI</title>
      </Helmet>
      <DashboardHeader title="Dashboard" subtitle="Welcome back! Here's your academic overview." />
      
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="group p-5 rounded-xl glass-card hover-lift"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.label}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <section className="p-6 rounded-xl glass-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">Upcoming Deadlines</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/assignments">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.title}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div
                    className={`w-2 h-12 rounded-full ${
                      deadline.priority === "high"
                        ? "bg-destructive"
                        : deadline.priority === "medium"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{deadline.title}</h4>
                    <p className="text-sm text-muted-foreground">{deadline.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {deadline.date}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Study Progress */}
          <section className="p-6 rounded-xl glass-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">Study Progress</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/progress">
                  View Details <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-5">
              {studyProgress.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{subject.subject}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{subject.completed}%</span>
                  </div>
                  <Progress value={subject.completed} className="h-2" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Today's Study Plan */}
        <section className="p-6 rounded-xl glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Today's Study Plan</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/planner">
                View Full Plan <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-sm text-blue-600 font-medium mb-1">Morning (9 AM - 12 PM)</div>
              <div className="font-semibold text-foreground">Data Structures</div>
              <div className="text-sm text-muted-foreground mt-1">Binary Trees & Graphs</div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-sm text-green-600 font-medium mb-1">Afternoon (2 PM - 5 PM)</div>
              <div className="font-semibold text-foreground">Physics</div>
              <div className="text-sm text-muted-foreground mt-1">Quantum Mechanics Ch. 5</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-sm text-purple-600 font-medium mb-1">Evening (7 PM - 9 PM)</div>
              <div className="font-semibold text-foreground">Mathematics</div>
              <div className="text-sm text-muted-foreground mt-1">Differential Equations</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
