import React, { useState, useEffect } from "react";
import api from "./services/api"; // ✅ centralized API service
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  // Todos
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Auth
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchTodos();
    }
  }, []);

  // --------------------------
  // Auth Handlers
  // --------------------------
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.warning("⚠️ Enter username and password");

    try {
      const endpoint = isLogin ? "login" : "register";
      const res = await api.post(`/auth/${endpoint}`, { username, password });
      localStorage.setItem("token", res.data.token);
      setLoggedIn(true);
      setUsername("");
      setPassword("");
      fetchTodos();
      toast.success(`✅ ${isLogin ? "Logged in" : "Registered"} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Authentication failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setTodos([]);
    toast.info("🔒 Logged out");
  };

  // --------------------------
  // Todos Handlers
  // --------------------------
  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch todos");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return toast.warning("⚠️ Enter a task");

    try {
      const res = await api.post("/todos", { title: trimmed });
      setTodos([...todos, res.data]);
      setTitle("");
      toast.success("✅ Task added!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Error adding task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
      toast.warn("🗑️ Task deleted!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error deleting task");
    }
  };

  const openEditModal = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return toast.warning("⚠️ Enter a task");

    try {
      const res = await api.put(`/todos/${editId}`, { title: trimmed });
      setTodos(todos.map((t) => (t._id === editId ? res.data : t)));
      setModalOpen(false);
      toast.info("✏️ Task updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Error updating task");
    }
  };

  // --------------------------
  // Render
  // --------------------------
  if (!loggedIn) {
    return (
      <div className="auth-container">
        <h1>{isLogin ? "🔑 Login" : "📝 Register"}</h1>
        <form onSubmit={handleAuth}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p className="switch-auth" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>📋 My Todo App</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <form onSubmit={handleAdd} className="todo-form">
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p className="no-tasks">No tasks yet! 📝</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              <span>{todo.title}</span>
              <div>
                <button onClick={() => openEditModal(todo)}>Edit</button>
                <button onClick={() => handleDelete(todo._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2025 Made With <span style={{ color: "red" }}>❤️</span> MJ. All Rights Reserved.
        </p>
      </footer>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
