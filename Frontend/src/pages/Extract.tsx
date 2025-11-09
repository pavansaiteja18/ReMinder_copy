import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ExtractedTasksList } from "@/components/extract/ExtractedTasksList";
import { useAuthStore } from "@/store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Extract() {
  const [chatText, setChatText] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<any[]>([]);
  const { user, token } = useAuthStore();

  // 🔹 Extract tasks from backend (calls Lyzr API)
  const handleExtract = async () => {
    if (!chatText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/tasks/extract-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatText,
          userEmail: "nikhilsiddartha21@gmail.com",
        }),
      });
      console.log("This is hoitted in frontend")
      if (!response.ok) throw new Error("Failed to extract tasks");

      const data = await response.json();
      console.log("🧾 Raw backend data:", data);

      // ✅ Fix: Parse nested JSON string if backend returns stringified JSON
      let parsedData;
      if (typeof data.response === "string") {
        parsedData = JSON.parse(data.response);
      } else if (data.response?.tasks) {
        parsedData = data.response;
      } else {
        parsedData = data;
      }

      console.log("✅ Parsed data from backend:", parsedData);

      const tasksArray = Array.isArray(parsedData.tasks)
        ? parsedData.tasks
        : parsedData.output?.tasks || [];

      if (!tasksArray.length) {
        toast.error("No tasks found in the text");
        setExtractedTasks([]);
        return;
      }

      // 🧩 Format each task for display
      const formattedTasks = tasksArray.map((t: any, idx: number) => ({
        id: `${idx + 1}`,
        title: t.task || t.title || t.description || "Untitled Task",
        owner: t.owner || "Unassigned",
        deadline: t.deadline || "No deadline",
        priority: t.priority || "Medium",
      }));

      setExtractedTasks(formattedTasks);
      toast.success(`✅ ${formattedTasks.length} tasks extracted successfully!`);
    } catch (error) {
      console.error("❌ Extraction error:", error);
      toast.error("Failed to extract tasks");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add extracted task to MongoDB (Kanban board)
  const handleAddToBoard = async (task: any) => {
    if (!token) {
      toast.error("You must be logged in to add tasks");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error("Failed to add task");
      toast.success(`✅ Task "${task.title}" added to board`);
    } catch (err) {
      console.error("❌ Add-to-board error:", err);
      toast.error("Error adding task");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Extract
        </h1>
        <p className="text-muted-foreground mt-1">
          Paste chat conversations to automatically extract tasks and action items
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Input Text</CardTitle>
          <CardDescription>
            Paste meeting notes, chat logs, or any text containing tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: Pavan will fix the API bug by Monday. Sarah needs to update the docs by Wednesday..."
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <Button
            onClick={handleExtract}
            disabled={loading}
            className="btn-gradient"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Extract Tasks
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Display extracted tasks */}
      {extractedTasks.length > 0 && (
        <ExtractedTasksList
          tasks={extractedTasks}
          onAddToBoard={handleAddToBoard}
        />
      )}
    </div>
  );
}
