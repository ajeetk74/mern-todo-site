import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

// Backend API base URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
const TODOS_ENDPOINT = `${API_BASE}/todos`;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Disable right click
  useEffect(() => {
    const handleRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleRightClick);
    return () => document.removeEventListener("contextmenu", handleRightClick);
  }, []);

  // Fetch todos
  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(TODOS_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      toast.error("❌ Unable to fetch tasks");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("⚠️ Please enter a task!");
      return;
    }
    setError("");

    const isDuplicate = todos.some(
      (t) => t.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (isDuplicate) return toast.warning("⚠️ Task already exists!");

    try {
      const res = await axios.post(
        TODOS_ENDPOINT,
        { title: trimmedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, res.data]);
      setTitle("");
      toast.success("✅ Task added!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${TODOS_ENDPOINT}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    if (!trimmedTitle) return toast.warning("⚠️ Task cannot be empty");

    const isDuplicate = todos.some(
      (t) => t.title.toLowerCase() === trimmedTitle.toLowerCase() && t._id !== editId
    );
    if (isDuplicate) return toast.warning("⚠️ Task already exists");

    try {
      const res = await axios.put(
        `${TODOS_ENDPOINT}/${editId}`,
        { title: trimmedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map((t) => (t._id === editId ? res.data : t)));
      setModalOpen(false);
      toast.info("✏️ Task updated!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setTodos([]);
  };

  if (!token)
    return (
      <div className="auth-container">
        <h1>📋 MERN Todo App</h1>
        <div className="auth-forms">
          <Login setToken={setToken} setUser={setUser} />
          <Register />
        </div>
      </div>
    );

  return (
    <div className="app-container">
      <h1>📋 {user.username}'s Todo List</h1>
      <button className="logout-btn" onClick={handleLogout}>
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
        <p className="no-tasks">No tasks yet! Add a task. 📝</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              <span
                style={{ textDecoration: todo.completed ? "line-through" : "none" }}
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
          © 2025 Made With <span style={{ color: "red" }}>❤️</span> MJ. All Rights
          Reserved.
        </p>
      </footer>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
