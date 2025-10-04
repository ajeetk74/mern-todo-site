// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import path from "path";
import { fileURLToPath } from "url";
=======
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

<<<<<<< HEAD
// ----------------------
// Middleware
// ----------------------
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json());

// ----------------------
// MongoDB connection
// ----------------------
=======
// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-todo-ochre.vercel.app",
  "https://ajeetk74.github.io",
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

<<<<<<< HEAD
// ----------------------
// Schemas & Models
// ----------------------
=======
// ✅ Schemas & Models
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

<<<<<<< HEAD
const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

// ----------------------
// Middleware: verify JWT
// ----------------------
=======
// Compound index to prevent duplicate titles for the same user
TodoSchema.index({ title: 1, user: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

// ✅ Authentication Middleware
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
<<<<<<< HEAD
    return res.status(401).json({ message: "Invalid token" });
=======
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Auth Routes
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Todo Routes
app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.json(todos);
  } catch (err) {
    console.error("Fetch Todos Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
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
  res.json({ token, user: { id: user._id, username: user.username } });
});

<<<<<<< HEAD
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, username: user.username } });
});

// ----------------------
// Todo Routes (protected)
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
// Serve React frontend
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "mern-todo-frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "mern-todo-frontend/dist", "index.html"));
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => console.log(`🚀 Backend & Frontend running on http://localhost:${PORT}`));
=======
// ✅ Add Todo
app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const trimmedTitle = req.body.title?.trim();
    if (!trimmedTitle) return res.status(400).json({ message: "Title required" });

    // Prevent duplicate tasks for the same user
    const existing = await Todo.findOne({ title: trimmedTitle, user: req.userId });
    if (existing) return res.status(400).json({ message: "Task already exists" });

    const todo = new Todo({ title: trimmedTitle, completed: false, user: req.userId });
    await todo.save();

    res.status(201).json(todo);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Task already exists" });
    console.error("Add Todo Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Update Todo
app.put("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: "Task not found" });

    if (title) {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return res.status(400).json({ message: "Title cannot be empty" });

      const duplicate = await Todo.findOne({
        title: trimmedTitle,
        user: req.userId,
        _id: { $ne: req.params.id }, // exclude current todo
      });
      if (duplicate) return res.status(400).json({ message: "Task with this title already exists" });

      todo.title = trimmedTitle;
    }

    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Task with this title already exists" });
    console.error("Update Todo Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Delete Todo
app.delete("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Todo Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
