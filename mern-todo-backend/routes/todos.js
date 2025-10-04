import express from "express";
import Todo from "../models/Todo.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get todos for user
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add todo
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const todo = new Todo({ title, userId: req.userId });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update todo
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, completed },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete todo
router.delete("/:id", auth, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
