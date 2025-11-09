import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import { errorHandler } from "./middleware/errorHandler.js";
import recallRoutes from "./routes/recallRoutes.js";
// dotenv.config();

// 🔍 Debug: check if .env loaded
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing! Check your .env file.");
} else {
  console.log("✅ OPENAI_API_KEY loaded successfully.");
}


// Load environment variables

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/recall", recallRoutes);
// Error Handler
// app.use(errorHandler);

// ==============================
// ✅ Load and start the server here
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// No need to export app anymore since it’s self-contained
