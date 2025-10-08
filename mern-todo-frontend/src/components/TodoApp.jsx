import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function TodoApp({ token, user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  // -------------------------
  // ✅ Fetch Todos
  // -------------------------
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/todos`, authHeaders);
      setTodos(res.data);
    } catch {
      toast.error("⚠️ Unable to fetch tasks 😞");
    }
  };

  // -------------------------
  // ✅ Add Todo
  // -------------------------
  const handleAddTodo = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return toast.warning("⚠️ Task cannot be empty 📝");

    // Check for duplicate title on frontend
    if (todos.some((t) => t.title.toLowerCase() === title.toLowerCase()))
      return toast.error("⚠️ Task already exists! 🚫");

    try {
      const res = await axios.post(`${API_BASE}/todos`, { title }, authHeaders);
      const newTodo = { ...res.data, animation: "added" };
      setTodos([...todos, newTodo]);
      setNewTitle("");
      toast.success("✅ Task added successfully! 🎯");

      setTimeout(() => {
        setTodos((prev) =>
          prev.map((t) => (t._id === newTodo._id ? { ...t, animation: "" } : t))
        );
      }, 500);
    } catch (err) {
      const message = err.response?.data?.message || "Error adding task ❌";
      toast.error(message);
    }
  };

  // -------------------------
  // ✅ Delete Todo
  // -------------------------
  const handleDelete = async (id) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, animation: "deleted" } : t))
      );
      setTimeout(async () => {
        await axios.delete(`${API_BASE}/todos/${id}`, authHeaders);
        setTodos((prev) => prev.filter((t) => t._id !== id));
        toast.info("🗑️ Task deleted successfully!");
      }, 300);
    } catch {
      toast.error("❌ Error deleting task");
    }
  };

  // -------------------------
  // ✅ Edit Todo
  // -------------------------
  const openEditModal = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    const title = editTitle.trim();
    if (!title) return toast.warning("⚠️ Task cannot be empty 📝");
    if (!editId) return toast.error("⚠️ Invalid task ⚡");

    // Check for duplicate title on frontend
    if (todos.some((t) => t.title.toLowerCase() === title.toLowerCase() && t._id !== editId))
      return toast.error("🚫 Task with this name already exists!");

    try {
      const res = await axios.put(`${API_BASE}/todos/${editId}`, { title }, authHeaders);
      setTodos((prev) =>
        prev.map((t) => (t._id === editId ? { ...res.data, animation: "edited" } : t))
      );

      setModalOpen(false);
      setEditId(null);
      setEditTitle("");
      toast.info("✏️ Task updated successfully! 🔄");

      setTimeout(() => {
        setTodos((prev) =>
          prev.map((t) => (t._id === res.data._id ? { ...t, animation: "" } : t))
        );
      }, 500);
    } catch (err) {
      const message = err.response?.data?.message || "Error updating task ❌";
      toast.error(message);
    }
  };

  // -------------------------
  // ✅ Toggle Complete
  // -------------------------
  const toggleComplete = async (todo) => {
    try {
      const res = await axios.put(
        `${API_BASE}/todos/${todo._id}`,
        { completed: !todo.completed },
        authHeaders
      );
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? res.data : t)));
      toast.success(todo.completed ? "⏳ Marked as incomplete" : "🎉 Marked as complete!");
    } catch {
      toast.error("⚠️ Error updating task");
    }
  };

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="todo-container">
        <header className="header">
          <h1>📋 My Todo List</h1>
          <p>👋 Hey {user?.username}! Here are your tasks below ⬇️</p>
          <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
        </header>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="✍️ Add a new task..."
          />
          <button type="submit">➕ Add</button>
        </form>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <p className="no-tasks">✨ No tasks yet. Start your journey! 🚀</p>
          ) : (
            todos.map((todo) => (
              <li key={todo._id} className={`todo-item ${todo.animation}`}>
                <div className="todo-text">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo)}
                  />
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.completed ? `✅ ${todo.title}` : `🕓 ${todo.title}`}
                  </span>
                </div>
                <div className="actions">
                  <button className="edit" onClick={() => openEditModal(todo)}>✏️</button>
                  <button className="delete" onClick={() => handleDelete(todo._id)}>🗑️</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Edit Task</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="update" onClick={handleUpdate}>💾 Update</button>
              <button
                className="cancel"
                onClick={() => {
                  setModalOpen(false);
                  setEditId(null);
                  setEditTitle("");
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        © 2025 Made With <span className="heart">❤️</span> MJ. All Rights Reserved.
      </footer>
    </div>
  );
}
