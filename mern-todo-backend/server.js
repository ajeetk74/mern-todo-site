import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middlewares
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ------------------------
// User Schema & Model
// ------------------------
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// ------------------------
// Todo Schema & Model
// ------------------------
const TodoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", TodoSchema);

// ------------------------
// Authentication Middleware
// ------------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// ------------------------
// Auth Routes
// ------------------------
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// ------------------------
// Todo Routes (Authenticated)
// ------------------------
app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", error: err.message });
  }
});

app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") return res.status(400).json({ message: "Title is required" });

    const existing = await Todo.findOne({ user: req.user.id, title: title.trim() });
    if (existing) return res.status(400).json({ message: "Task already exists" });

    const todo = new Todo({ user: req.user.id, title: title.trim() });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error adding todo", error: err.message });
  }
});

app.put("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (title) {
      const existing = await Todo.findOne({ user: req.user.id, title: title.trim(), _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ message: "Task already exists" });
      todo.title = title.trim();
    }

    if (typeof completed === "boolean") todo.completed = completed;

    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", error: err.message });
  }
});

app.delete("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.remove();
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err.message });
  }
});

// ------------------------
// Start Server
// ------------------------
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
