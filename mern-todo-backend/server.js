import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// =====================
// ✅ CORS Configuration
// =====================
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-todo-site.vercel.app",
  "https://ajeetk74.github.io",
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// =====================
// ✅ Middleware
// =====================
app.use(express.json());

// =====================
// ✅ MongoDB Connection
// =====================
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// =====================
// ✅ Schemas & Models
// =====================
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Prevent duplicate titles per user
TodoSchema.index({ title: 1, user: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

// =====================
// ✅ Auth Middleware
// =====================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// =====================
// ✅ Auth Routes
// =====================
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

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
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =====================
// ✅ Todo Routes
// =====================

// Fetch all todos
app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("Fetch Todos Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new todo
app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const title = req.body.title?.trim();
    if (!title) return res.status(400).json({ message: "Title required" });

    const existing = await Todo.findOne({ title, user: req.userId });
    if (existing) return res.status(400).json({ message: "Task already exists" });

    const todo = await Todo.create({ title, user: req.userId });
    res.status(201).json(todo);
  } catch (err) {
    console.error("Add Todo Error:", err);
    if (err.code === 11000) return res.status(400).json({ message: "Task already exists" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a todo
app.put("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid task ID" });

    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: "Task not found" });

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return res.status(400).json({ message: "Title cannot be empty" });

      const duplicate = await Todo.findOne({
        title: trimmedTitle,
        user: req.userId,
        _id: { $ne: req.params.id },
      });
      if (duplicate) return res.status(400).json({ message: "Task with this title already exists" });

      todo.title = trimmedTitle;
    }

    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Update Todo Error:", err);
    if (err.code === 11000) return res.status(400).json({ message: "Task with this title already exists" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a todo
app.delete("/todos/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid task ID" });

    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Todo Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =====================
// ✅ Root Route
// =====================
app.get("/", (req, res) => {
  res.send("✅ MERN Todo API is running successfully!");
});

// =====================
// ✅ Start Server
// =====================
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
