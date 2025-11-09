import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, User } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  owner: string;
  deadline: string;
  priority: string;
}

interface ExtractedTasksListProps {
  tasks: Task[];
  onAddToBoard?: (task: Task) => void; // ✅ new prop
}

export const ExtractedTasksList = ({ tasks, onAddToBoard }: ExtractedTasksListProps) => {
  const handleSaveTask = (task: Task) => {
    toast.success(`Task "${task.title}" added to your board`);
    onAddToBoard?.(task); // ✅ send one task
  };

  const handleSaveAll = () => {
    tasks.forEach((task) => onAddToBoard?.(task)); // ✅ send all
    toast.success(`${tasks.length} tasks added to your board`);
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Extracted Tasks ({tasks.length})</CardTitle>
          <Button onClick={handleSaveAll} className="btn-gradient">
            <Check className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-glow transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{task.title}</h4>
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {task.owner}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {task.deadline}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSaveTask(task)}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
