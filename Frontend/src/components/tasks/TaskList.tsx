import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/types/index";

interface TaskListProps {
  searchQuery: string;
}

export const TaskList = ({ searchQuery }: TaskListProps) => {
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <motion.div
          key={task._id || task.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className="card-elevated cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate(`/task/${task._id || task.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{task.title}</h3>
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
                    <Badge variant="outline">{task.status}</Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {task.owner && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {task.owner}
                      </div>
                    )}
                    {task.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
