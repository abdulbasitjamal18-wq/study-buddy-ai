import { BarChart3, TrendingUp, BookOpen, Clock, Target, Award } from "lucide-react";
import { Progress as ProgressBar } from "@/components/ui/progress";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Helmet } from "react-helmet-async";

const subjects = [
  {
    name: "Computer Science",
    topics: [
      { name: "Data Structures", completed: 100 },
      { name: "Algorithms", completed: 75 },
      { name: "Database Systems", completed: 50 },
      { name: "Operating Systems", completed: 25 },
    ],
    totalProgress: 62,
    studyHours: 45,
    color: "bg-blue-500",
  },
  {
    name: "Mathematics",
    topics: [
      { name: "Calculus", completed: 90 },
      { name: "Linear Algebra", completed: 80 },
      { name: "Differential Equations", completed: 60 },
      { name: "Statistics", completed: 40 },
    ],
    totalProgress: 68,
    studyHours: 38,
    color: "bg-green-500",
  },
  {
    name: "Physics",
    topics: [
      { name: "Mechanics", completed: 85 },
      { name: "Thermodynamics", completed: 70 },
      { name: "Electromagnetism", completed: 45 },
      { name: "Quantum Physics", completed: 20 },
    ],
    totalProgress: 55,
    studyHours: 32,
    color: "bg-purple-500",
  },
];

const weeklyActivity = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 5 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 3 },
];

const Progress = () => {
  const totalHours = weeklyActivity.reduce((sum, d) => sum + d.hours, 0);
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));
  const averageProgress = Math.round(subjects.reduce((sum, s) => sum + s.totalProgress, 0) / subjects.length);

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
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalHours} hrs</div>
          </div>

          <div className="p-5 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-muted-foreground">Topics Covered</span>
            </div>
            <div className="text-3xl font-bold text-foreground">12</div>
          </div>

          <div className="p-5 rounded-xl glass-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-muted-foreground">Streak</span>
            </div>
            <div className="text-3xl font-bold text-foreground">7 days</div>
          </div>
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
                    <span className="text-xs text-muted-foreground mb-1">{day.hours}h</span>
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
          </div>
        </div>

        {/* Detailed Topic Progress */}
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
                    <div key={topic.name} className="p-3 rounded-lg bg-muted/50">
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
      </div>
    </>
  );
};

export default Progress;
