import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI) // ✅ no deprecated options
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Todo schema & model
const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", TodoSchema);

// Routes
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", error: err.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "")
      return res.status(400).json({ message: "Title is required" });

    const existing = await Todo.findOne({ title: title.trim() });
    if (existing)
      return res.status(400).json({ message: "Task already exists" });

    const todo = new Todo({ title: title.trim() });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error adding todo", error: err.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title || title.trim() === "")
      return res.status(400).json({ message: "Title is required" });

    const existing = await Todo.findOne({
      title: title.trim(),
      _id: { $ne: req.params.id },
    });
    if (existing)
      return res.status(400).json({ message: "Task already exists" });

    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), completed: completed || false },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", error: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
