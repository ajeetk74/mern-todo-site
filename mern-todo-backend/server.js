import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ----------------------
// Middlewares
// ----------------------
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json());

// ----------------------
// MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ----------------------
// Mongoose Schemas & Models
// ----------------------
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

// ----------------------
// JWT Auth Middleware
// ----------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ----------------------
// Auth Routes
// ----------------------
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// ----------------------
// Todo Routes (Protected)
// ----------------------
app.get("/todos", authMiddleware, async (req, res) => {
  const todos = await Todo.find({ user: req.userId });
  res.json(todos);
});

app.post("/todos", authMiddleware, async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "")
    return res.status(400).json({ message: "Title required" });

  const existing = await Todo.findOne({ title: title.trim(), user: req.userId });
  if (existing) return res.status(400).json({ message: "Task already exists" });

  const todo = new Todo({ title: title.trim(), user: req.userId });
  await todo.save();
  res.status(201).json(todo);
});

app.put("/todos/:id", authMiddleware, async (req, res) => {
  const { title, completed } = req.body;
  const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
  if (!todo) return res.status(404).json({ message: "Task not found" });

  if (title) todo.title = title.trim();
  if (completed !== undefined) todo.completed = completed;

  await todo.save();
  res.json(todo);
});

app.delete("/todos/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!todo) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
