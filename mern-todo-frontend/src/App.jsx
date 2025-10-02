import React, { useEffect, useState } from "react";
import api from "./services/api"; // Axios instance with JWT token
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Disable right-click on homepage
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Fetch tasks for logged-in user
  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      toast.error("❌ Failed to fetch tasks");
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      toast.success("✅ Logged in successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Login failed");
    }
  };

  const handleRegister = async (username, password) => {
    try {
      await api.post("/auth/register", { username, password });
      toast.success("✅ Registered successfully");
      handleLogin(username, password);
    } catch (err) {
      console.error(err);
      toast.error("❌ Registration failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("⚠️ Please enter task!");
      return;
    }
    setError("");

    const isDuplicate = todos.some(
      (t) => t.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (isDuplicate) {
      toast.warning("⚠️ Task already exists!");
      return;
    }

    try {
      const res = await api.post("/todos", { title: trimmedTitle, completed: false });
      setTodos([...todos, res.data]);
      toast.success("✅ Task added!");
      setTitle("");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding task");
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
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      toast.warning("⚠️ Task cannot be empty");
      return;
    }

    const isDuplicate = todos.some(
      (t) => t.title.toLowerCase() === trimmedTitle.toLowerCase() && t._id !== editId
    );
    if (isDuplicate) {
      toast.warning("⚠️ Task already exists!");
      return;
    }

    try {
      const res = await api.put(`/todos/${editId}`, { title: trimmedTitle });
      setTodos(todos.map((t) => (t._id === editId ? res.data : t)));
      toast.info("✏️ Task updated!");
      setModalOpen(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating task");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTodos([]);
    toast.info("🚪 Logged out");
  };

  if (!token) {
    // Render Login/Register
    return (
      <div className="app-container">
        <h1>📋 MERN Todo App</h1>
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content">
        <h1>📋 My Todo App</h1>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>

        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim() !== "") setError("");
            }}
          />
          <button type="submit">Add</button>
        </form>
        {error && <p className="error-message">{error}</p>}

        {todos.length === 0 ? (
          <p className="no-tasks">No tasks yet! Please add a task. 📝</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <span
                  style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
                  onClick={async () => {
                    try {
                      const res = await api.put(`/todos/${todo._id}`, {
                        completed: !todo.completed,
                      });
                      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)));
                    } catch (err) {
                      console.error(err);
                      toast.error("❌ Error updating task status");
                    }
                  }}
                >
                  {todo.title}
                </span>
                <div>
                  <button className="edit" onClick={() => openEditModal(todo)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(todo._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

// ✅ Login/Register form component
function AuthForm({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-form">
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
      <button onClick={() => onRegister(username, password)}>Register</button>
      <button onClick={() => onLogin(username, password)}>Login</button>
    </div>
  );
}

export default App;
