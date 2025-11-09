import fetch from "node-fetch";
import Task from "../models/Task.js";

/* -------------------------------------------------------------------------- */
/* 🧠 Extract structured tasks using Lyzr AI */
/* -------------------------------------------------------------------------- */
export const extractTasks = async (req, res) => {
  try {
    console.log("This Api end point is hitteed")
    const { chatText, userEmail } = req.body;
    if (!chatText) return res.status(400).json({ error: "chatText is required" });

    const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LYZR_API_KEY,
      },
      body: JSON.stringify({
        user_id: userEmail || "nikhilsiddartha21@gmail.com",
        agent_id: "6907568240006cfb21b17df3",
        session_id: "6907568240006cfb21b17df3-wal5a364r8",
        message: chatText,
      }),
    });

    const data = await response.json();
    let tasks = [];

    // 🧩 Try parsing possible JSON responses
    if (typeof data.response === "string") {
      try {
        const inner = JSON.parse(data.response);
        tasks = inner.tasks || [];
      } catch {
        console.warn("⚠️ Could not parse nested JSON from Lyzr");
      }
    }

    if (!Array.isArray(tasks)) {
      tasks = data?.tasks || data?.output?.tasks || data?.output || [];
    }

    const formattedTasks = Array.isArray(tasks)
      ? tasks.map((t, i) => ({
          id: i + 1,
          title: (t.task || t.title || `Task ${i + 1}`).trim(),
          owner: (t.owner || "unassigned").trim().toLowerCase(),
          deadline: t.deadline || "no deadline",
          priority: (t.priority || "medium").trim().toLowerCase(),
        }))
      : [];

    res.status(200).json({ tasks: formattedTasks });
  } catch (err) {
    console.error("❌ Lyzr extraction error:", err);
    res.status(500).json({ error: "Failed to extract tasks" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📋 CRUD: Get all tasks for the logged-in user */
/* -------------------------------------------------------------------------- */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🔍 Get a single task */
/* -------------------------------------------------------------------------- */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ➕ Create a new task */
/* -------------------------------------------------------------------------- */
export const createTask = async (req, res) => {
  try {
    const { title, owner, deadline, priority, status } = req.body;
    const task = await Task.create({
      title: title?.trim(),
      owner: owner?.trim().toLowerCase() || "unassigned",
      deadline,
      priority: priority?.trim().toLowerCase() || "medium",
      status: status?.trim().toLowerCase() || "todo",
      createdBy: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to create task", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🧱 Bulk create extracted tasks */
/* -------------------------------------------------------------------------- */
export const createTasksBulk = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks))
      return res.status(400).json({ message: "Tasks must be an array" });

    const formatted = tasks.map((t) => ({
      title: t.title?.trim() || "Untitled",
      owner: (t.owner || "unassigned").toLowerCase(),
      deadline: t.deadline || null,
      priority: (t.priority || "medium").toLowerCase(),
      status: (t.status || "todo").toLowerCase(),
      createdBy: req.user._id,
    }));

    const saved = await Task.insertMany(formatted);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to add bulk tasks", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✏️ Update a task */
/* -------------------------------------------------------------------------- */
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update task", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🗑️ Delete a task */
/* -------------------------------------------------------------------------- */
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "✅ Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete task", error: err.message });
  }
};
