import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// ✅ Use environment variable for backend URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
const TODOS_ENDPOINT = `${API_BASE}/todos`;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(TODOS_ENDPOINT);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("⚠️ Please enter task! Task can't be empty.");
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
      const res = await axios.post(TODOS_ENDPOINT, {
        title: trimmedTitle,
        completed: false,
      });
      setTodos([...todos, res.data]);
      toast.success("✅ Task added!");
      setTitle("");
    } catch (err) {
      console.error("Error adding task:", err.response?.data || err.message);
      toast.error("❌ Error adding task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${TODOS_ENDPOINT}/${id}`);
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
      toast.warning("⚠️ Please enter task! Task can't be empty.");
      return;
    }

    const isDuplicate = todos.some(
      (t) =>
        t.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        t._id !== editId
    );
    if (isDuplicate) {
      toast.warning("⚠️ Task already exists!");
      return;
    }

    try {
      const res = await axios.put(`${TODOS_ENDPOINT}/${editId}`, {
        title: trimmedTitle,
        completed: false,
      });
      setTodos(todos.map((t) => (t._id === editId ? res.data : t)));
      toast.info("✏️ Task updated!");
      setModalOpen(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating task");
    }
  };

  return (
    <div className="app-container">
      <div className="content">
        <div className="container">
          <h1>📋 My Todo App</h1>

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
                  <span>{todo.title}</span>
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
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2025 Made With <span style={{ color: "red" }}>❤️</span> MJ. All Rights Reserved.
        </p>
      </footer>

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

export default App;
