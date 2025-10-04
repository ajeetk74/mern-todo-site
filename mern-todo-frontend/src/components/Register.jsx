import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/auth/register`, { username, password });
      toast.success("✅ Registration successful! Please login.");
      navigate("/login");
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.warning("⚠️ Fill all fields");

    try {
      await axios.post(`${API_BASE}/auth/register`, { username, password });
      toast.success("✅ Registration successful! Please login.");
      navigate("/login"); // Redirect to login page
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleRegister} autoComplete="off">
=======
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
<<<<<<< HEAD
          required
=======
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
          required
        />
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
=======
        />
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
        </p>
      </form>
    </div>
  );
}
