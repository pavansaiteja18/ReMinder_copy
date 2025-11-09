import express from "express";
import {
  extractTasks,
  getTasks,
  getTaskById,
  createTask,
  createTasksBulk,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for AI extraction
router.post("/extract-tasks", extractTasks);

// Protected routes
router.use(protect);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.post("/bulk", createTasksBulk);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
