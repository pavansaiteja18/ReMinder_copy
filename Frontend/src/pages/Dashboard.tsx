import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import {
  CheckSquare,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  // Calculate task stats
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "done").length,
    completionRate:
      Math.round(
        (tasks.filter((t) => t.status === "done").length / tasks.length) * 100
      ) || 0,
  };

  // Dummy chart data (you can replace with actual weekly analytics)
  const completionData = [
    { day: "Mon", rate: 78 },
    { day: "Tue", rate: 82 },
    { day: "Wed", rate: 85 },
    { day: "Thu", rate: 88 },
    { day: "Fri", rate: 90 },
    { day: "Sat", rate: 86 },
    { day: "Sun", rate: stats.completionRate },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* 👋 Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your productivity overview
        </p>
      </div>

      {/* 📊 Stats Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total.toString()}
          icon={CheckSquare}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress.toString()}
          icon={Clock}
          trend="+5%"
          trendUp={true}
        />
        <StatsCard
          title="Completed"
          value={stats.completed.toString()}
          icon={CheckSquare}
          trend="+8%"
          trendUp={true}
        />

        {/* 📈 Completion Rate (Dialog + LineChart) */}
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <StatsCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={TrendingUp}
                trend="+3%"
                trendUp={true}
              />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Completion Rate — Last 7 days</DialogTitle>
            <DialogDescription className="mb-4">
              Interactive trend of task completion rate over the last week.
            </DialogDescription>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData}>
                  <XAxis dataKey="day" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: "#7c3aed" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🗂 Kanban Task Board */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Task Board</CardTitle>
        </CardHeader>
        <CardContent>
          <KanbanBoard />
        </CardContent>
      </Card>
    </motion.div>
  );
}
