import express from "express";
import { recallSearch } from "../controllers/recallController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protected route: user must be logged in
router.post("/search", protect, recallSearch);

export default router;
