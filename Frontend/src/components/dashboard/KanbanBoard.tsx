import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTasksStore } from "@/store/tasksStore";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export const KanbanBoard = () => {
  const { tasks } = useTasksStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // ✅ only the logged-in user's tasks
  const userTasks = user
    ? tasks.filter((t) => (t.owner || "").toLowerCase() === user.name?.toLowerCase())
    : [];

  // group tasks by status
  const todoTasks = userTasks.filter((t) => t.status === "todo");
  const inProgressTasks = userTasks.filter((t) => t.status === "in-progress");
  const doneTasks = userTasks.filter((t) => t.status === "done");

  const columns = [
    { id: "todo", title: "To Do", tasks: todoTasks },
    { id: "in-progress", title: "In Progress", tasks: inProgressTasks },
    { id: "done", title: "Done", tasks: doneTasks },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <div key={column.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              {column.title}
            </h3>
            <Badge variant="secondary">{column.tasks.length}</Badge>
          </div>

          <div className="space-y-2">
            {column.tasks.map((task) => (
              <motion.div
                key={task._id || task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-glow transition-all"
                  onClick={() => navigate(`/task/${task._id || task.id}`)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.owner}
                      </span>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
