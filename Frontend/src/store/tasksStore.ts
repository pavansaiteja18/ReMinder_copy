import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/api/axios";
import type { TasksState, Task as TTask } from "@/types";
import { useAuthStore } from "./authStore";

type RawTask = any;

const normalize = (t: RawTask): TTask => {
  const _id = t._id || t.id || (t._id && String(t._id)) || undefined;
  const id = t.id || _id;

  return {
    ...t,
    _id,
    id,
    title: t.title ?? "Untitled",
    owner: t.owner ? String(t.owner) : "unassigned",
    priority: (t.priority || "medium").toString().toLowerCase(),
    status: (t.status || "todo").toString().toLowerCase(),
    deadline: t.deadline || null,
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || new Date().toISOString(),
    tags: t.tags || [],
    description: t.description || "",
  } as TTask;
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,

      // ✅ Fetch all tasks
      fetchTasks: async () => {
        set({ loading: true });
        try {
          const res = await api.get("/tasks");
          const normalized = (res.data || []).map(normalize);
          set({ tasks: normalized, loading: false });
        } catch (err: any) {
          console.error(err);
          toast.error(err.response?.data?.message || "Failed to fetch tasks");
          set({ loading: false, error: err.message });
        }
      },

      // ✅ Add single task
      addTask: async (task) => {
        try {
          const { user } = useAuthStore.getState();
          const payload = {
            ...task,
            owner: task.owner || user?.name?.toLowerCase() || "unassigned",
          };
          const res = await api.post("/tasks", payload);
          const saved = normalize(res.data);
          set((state) => ({ tasks: [...state.tasks, saved] }));
          toast.success("Task added successfully!");
        } catch (err: any) {
          console.error(err);
          toast.error("Failed to add task");
          throw err;
        }
      },

      // ✅ Bulk add extracted tasks
      addExtractedTasks: async (tasksArr: any[]) => {
        try {
          const { user } = useAuthStore.getState();
          const owner = user?.name?.toLowerCase() || "unassigned";
          const payload = tasksArr.map((t) => ({
            ...t,
            owner: t.owner || owner,
            priority: (t.priority || "medium").toLowerCase(),
            status: (t.status || "todo").toLowerCase(),
          }));

          try {
            const res = await api.post("/tasks/bulk", { tasks: payload });
            const saved = (res.data || []).map(normalize);
            set((state) => ({ tasks: [...state.tasks, ...saved] }));
          } catch {
            const savedList: TTask[] = [];
            for (const p of payload) {
              const r = await api.post("/tasks", p);
              savedList.push(normalize(r.data));
            }
            set((state) => ({ tasks: [...state.tasks, ...savedList] }));
          }

          toast.success("Extracted tasks added to Kanban!");
        } catch (err: any) {
          console.error(err);
          toast.error("Failed to add extracted tasks");
          throw err;
        }
      },

      // ✅ Update task (returns updated Task)
      updateTask: async (id, updates) => {
        try {
          const res = await api.put(`/tasks/${id}`, updates);
          const updated = normalize(res.data);

          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id || t._id === id ? updated : t
            ),
          }));

          toast.success("Task updated");
          return updated; // ✅ important fix
        } catch (err: any) {
          console.error(err);
          toast.error("Failed to update task");
          throw err;
        }
      },

      // ✅ Move task (status change)
      moveTask: async (id, status) => {
        const { updateTask } = get();
        await updateTask(id, { status });
      },

      // ✅ Delete task
      deleteTask: async (id) => {
        try {
          await api.delete(`/tasks/${id}`);
          set((state) => ({
            tasks: state.tasks.filter(
              (t) => t.id !== id && t._id !== id
            ),
          }));
          toast.success("Task deleted");
        } catch (err: any) {
          console.error(err);
          toast.error("Failed to delete task");
          throw err;
        }
      },

      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: "tasks-storage",
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
