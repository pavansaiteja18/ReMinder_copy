import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  MessageSquare,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTasksStore } from "@/store/tasksStore";
import { toast } from "sonner";
import type { Task, Comment } from "@/types";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTasksStore();
  const [task, setTask] = useState<Task | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const foundTask = tasks.find((t) => t._id === id || t.id === id);
    if (foundTask) {
      setTask(foundTask);
      // Mock comments
      setComments([
        {
          id: "1",
          taskId: foundTask._id || foundTask.id,
          userId: "1",
          userName: "Pavan Kumar",
          content:
            "Started working on this. Will have initial draft by tomorrow.",
          createdAt: "2025-11-01T14:30:00Z",
        },
        {
          id: "2",
          taskId: foundTask._id || foundTask.id,
          userId: "2",
          userName: "Sarah Chen",
          content: "Great! Let me know if you need any design assets.",
          createdAt: "2025-11-01T15:00:00Z",
        },
      ]);
    } else {
      // if tasks not loaded yet, keep null — useTasks hook / tasksStore will fetch on mount
      setTask(null);
    }
  }, [id, tasks]);

  const handleAddComment = () => {
    if (!comment.trim() || !task) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      taskId: task._id || task.id,
      userId: "1",
      userName: "Current User",
      content: comment,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setComment("");
    toast.success("Comment added");
  };

  const handleDelete = async () => {
    if (!task) return;
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id || task.id);
      navigate("/tasks");
    }
  };

  const handleStatusChange = async (status: Task["status"]) => {
    if (!task) return;
    await updateTask(task._id || task.id, { status });
    setTask({ ...task, status } as Task);
  };

  if (!task) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Task not found</p>
      </div>
    );
  }

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const statusColors = {
    todo: "bg-gray-500/10 text-gray-500",
    "in-progress": "bg-blue-500/10 text-blue-500",
    done: "bg-green-500/10 text-green-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      {/* Header buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/tasks")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task Info */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{task.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
                <Badge className={statusColors[task.status]}>
                  {task.status}
                </Badge>
                {(task.tags || []).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {task.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Owner:</span> {task.owner}
              </span>
            </div>

            {task.deadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Due:</span>{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Created:</span>{" "}
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex gap-2">
            <Button
              variant={task.status === "todo" ? "default" : "outline"}
              onClick={() => handleStatusChange("todo")}
            >
              To Do
            </Button>
            <Button
              variant={task.status === "in-progress" ? "default" : "outline"}
              onClick={() => handleStatusChange("in-progress")}
            >
              In Progress
            </Button>
            <Button
              variant={task.status === "done" ? "default" : "outline"}
              onClick={() => handleStatusChange("done")}
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 p-3 rounded-lg bg-sidebar/50"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  {c.userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{c.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{c.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button onClick={handleAddComment} className="btn-gradient">
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
