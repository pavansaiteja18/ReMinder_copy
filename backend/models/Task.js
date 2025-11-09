import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      trim: true,
      default: "unassigned",
    },
    // ✅ Use Mixed type to safely handle any input before converting
    deadline: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🧹 Normalize and safely parse deadline before saving
taskSchema.pre("save", function (next) {
  if (this.title) this.title = this.title.trim().toLowerCase();
  if (this.owner) this.owner = this.owner.trim().toLowerCase();
  if (this.priority) this.priority = this.priority.trim().toLowerCase();
  if (this.status) this.status = this.status.trim().toLowerCase();

  // ✅ Convert deadline properly
  if (
    !this.deadline ||
    this.deadline === "no deadline" ||
    this.deadline === "" ||
    this.deadline === null
  ) {
    this.deadline = null;
  } else if (!(this.deadline instanceof Date)) {
    const parsed = new Date(this.deadline);
    this.deadline = isNaN(parsed.getTime()) ? null : parsed;
  }

  next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
