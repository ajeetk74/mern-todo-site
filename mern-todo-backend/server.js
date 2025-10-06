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

<<<<<<< HEAD
// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-todo-site.vercel.app",
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware
=======
// ✅ Allow all origins that will call frontend
app.use(cors({
  origin: ["https://ajeetk74.github.io", "https://mern-todo-site.vercel.app", "http://localhost:5173"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

>>>>>>> 74dea89 (Updated backend CORS & frontend routing fixes)
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

// Schemas
const UserSchema = new mongoose.Schema({ username: { type: String, required: true, unique: true }, password: { type: String, required: true } });
const TodoSchema = new mongoose.Schema({ title: { type: String, required: true }, completed: { type: Boolean, default: false }, user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } });
TodoSchema.index({ title: 1, user: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

// Auth middleware
const authMiddleware = (req,res,next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({ message:"Unauthorized" });
  try { req.userId = jwt.verify(token,JWT_SECRET).id; next(); } 
  catch { res.status(401).json({ message:"Invalid token" }); }
};

// Routes
app.post("/auth/register", async(req,res) => {
  try{
    const {username,password} = req.body;
    if(!username || !password) return res.status(400).json({message:"Username and password required"});
    if(await User.findOne({username})) return res.status(400).json({message:"Username exists"});
    const hashed = await bcrypt.hash(password,10);
    const user = await new User({username,password:hashed}).save();
    const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:"7d"});
    res.json({token,user:{id:user._id,username:user.username}});
  } catch(err){ res.status(500).json({message:"Server error",error:err.message}); }
});

app.post("/auth/login", async(req,res)=>{
  try{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user) return res.status(400).json({message:"Invalid credentials"});
    if(!await bcrypt.compare(password,user.password)) return res.status(400).json({message:"Invalid credentials"});
    const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:"7d"});
    res.json({token,user:{id:user._id,username:user.username}});
  }catch(err){ res.status(500).json({message:"Server error",error:err.message}); }
});

// Todo CRUD
app.get("/todos", authMiddleware, async(req,res)=>{ const todos = await Todo.find({user:req.userId}); res.json(todos); });
app.post("/todos", authMiddleware, async(req,res)=>{ const title = req.body.title?.trim(); if(!title) return res.status(400).json({message:"Title required"}); if(await Todo.findOne({title,user:req.userId})) return res.status(400).json({message:"Task exists"}); const todo = await new Todo({title,completed:false,user:req.userId}); await todo.save(); res.status(201).json(todo); });
app.put("/todos/:id", authMiddleware, async(req,res)=>{ const {title,completed} = req.body; const todo = await Todo.findOne({_id:req.params.id,user:req.userId}); if(!todo) return res.status(404).json({message:"Task not found"}); if(title){ const t=title.trim(); if(!t) return res.status(400).json({message:"Title cannot be empty"}); if(await Todo.findOne({title:t,user:req.userId,_id:{$ne:req.params.id}})) return res.status(400).json({message:"Task with this title exists"}); todo.title=t;} if(completed!==undefined) todo.completed=completed; await todo.save(); res.json(todo); });
app.delete("/todos/:id", authMiddleware, async(req,res)=>{ const todo = await Todo.findOneAndDelete({_id:req.params.id,user:req.userId}); if(!todo) return res.status(404).json({message:"Task not found"}); res.json({message:"Task deleted"}); });

<<<<<<< HEAD
app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const trimmedTitle = req.body.title?.trim();
    if (!trimmedTitle) return res.status(400).json({ message: "Title required" });

    const existing = await Todo.findOne({ title: trimmedTitle, user: req.userId });
    if (existing) return res.status(400).json({ message: "Task already exists" });

    const todo = new Todo({ title: trimmedTitle, completed: false, user: req.userId });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error("Add Todo Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

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
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

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
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
=======
// Start server
app.listen(PORT,()=>console.log(`🚀 Backend running on port ${PORT}`));
>>>>>>> 74dea89 (Updated backend CORS & frontend routing fixes)
