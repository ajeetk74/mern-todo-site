import React, { useState, useEffect } from "react";
import axios from "axios";
<<<<<<< HEAD
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
const TODOS_ENDPOINT = `${API_BASE}/todos`;

export default function TodoApp({ token, user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
=======
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function TodoApp({ token, user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

<<<<<<< HEAD
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
=======
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/todos`, authHeaders);
      setTodos(res.data);
    } catch (err) {
      console.error("Fetch Todos Error:", err.response || err);
      toast.error("⚠️ Unable to fetch tasks");
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return toast.warning("⚠️ Task cannot be empty");

    try {
      const res = await axios.post(`${API_BASE}/todos`, { title }, authHeaders);
      const newTodo = { ...res.data, animation: "added" };
      setTodos([...todos, newTodo]);
      setNewTitle("");
      toast.success("✅ Task added!");
      setTimeout(() => {
        setTodos((prev) =>
          prev.map((t) => (t._id === newTodo._id ? { ...t, animation: "" } : t))
        );
      }, 500);
    } catch (err) {
      console.error("Add Todo Error:", err.response || err);
      const message = err.response?.data?.message;
      if (message === "Task already exists") toast.error("⚠️ Task already exists!");
      else toast.error(message || "Error adding task");
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
    }
  };

  const handleDelete = async (id) => {
    try {
<<<<<<< HEAD
      await axios.delete(`${TODOS_ENDPOINT}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((t) => t._id !== id));
      toast.warn("🗑️ Task deleted!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error deleting task");
=======
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, animation: "deleted" } : t))
      );
      setTimeout(async () => {
        await axios.delete(`${API_BASE}/todos/${id}`, authHeaders);
        setTodos((prev) => prev.filter((t) => t._id !== id));
        toast.info("🗑️ Task deleted!");
      }, 300);
    } catch (err) {
      console.error("Delete Todo Error:", err.response || err);
      toast.error("Error deleting task");
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
    }
  };

  const openEditModal = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
<<<<<<< HEAD
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
=======
    const title = editTitle.trim();
    if (!title) return toast.warning("⚠️ Task cannot be empty");

    try {
      const res = await axios.put(`${API_BASE}/todos/${editId}`, { title }, authHeaders);
      setTodos((prev) =>
        prev.map((t) =>
          t._id === editId ? { ...res.data, animation: "edited" } : t
        )
      );
      setModalOpen(false);
      setEditId(null);
      setEditTitle("");
      toast.info("✏️ Task updated!");
      setTimeout(() => {
        setTodos((prev) =>
          prev.map((t) => (t._id === res.data._id ? { ...t, animation: "" } : t))
        );
      }, 500);
    } catch (err) {
      console.error("Update Todo Error:", err.response || err);
      const message = err.response?.data?.message;
      if (message?.includes("already exists")) toast.error("⚠️ Task with this name already exists!");
      else toast.error(message || "Error updating task");
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const res = await axios.put(
        `${API_BASE}/todos/${todo._id}`,
        { completed: !todo.completed },
        authHeaders
      );
      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)));
    } catch (err) {
      console.error("Toggle Complete Error:", err.response || err);
      toast.error("Error updating task");
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Todo Container */}
      <div className="todo-container">
        <header className="header">
          <h1>📋 My Todo List</h1>
         <p>{user?.username}'s tasks below ⬇️</p>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </header>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter new task..."
          />
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <p className="no-tasks">✨ No tasks yet. Add one!</p>
          ) : (
            todos.map((todo) => (
              <li key={todo._id} className={`todo-item ${todo.animation}`}>
                <div className="todo-text">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo)}
                  />
                  <span className={todo.completed ? "completed" : ""}>{todo.title}</span>
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
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)

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
<<<<<<< HEAD
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setModalOpen(false)}>Cancel</button>
=======
              <button className="update" onClick={handleUpdate}>Update</button>
              <button
                className="cancel"
                onClick={() => {
                  setModalOpen(false);
                  setEditId(null);
                  setEditTitle("");
                }}
              >
                Cancel
              </button>
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
<<<<<<< HEAD
        <p>
          © 2025 Made With <span style={{ color: "red" }}>❤️</span> MJ. All Rights Reserved.
        </p>
=======
        © 2025 Made With <span className="heart">❤️</span> MJ. All Rights Reserved.
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
      </footer>
    </div>
  );
}
