import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
const TODOS_ENDPOINT = `${API_BASE}/todos`;

export default function TodoApp({ token, user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(TODOS_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Unable to fetch tasks");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return toast.warning("⚠️ Task cannot be empty");

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
      toast.error(err.response?.data?.message || "❌ Error adding task");
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

  return (
    <div className="app-container">
      <h1>📋 {user.username}'s Todo List</h1>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id}>
            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.title}
            </span>
            <div>
              <button onClick={() => openEditModal(todo)}>Edit</button>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

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
    </div>
  );
}
