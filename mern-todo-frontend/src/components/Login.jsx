import React, { useState } from "react";
<<<<<<< HEAD
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
=======
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });

      // Store token and optional user info
      localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      // Call parent callback
      onLogin(res.data.token, res.data.user || null);

      toast.success("✅ Login successful!");
      navigate("/"); // redirect to TodoApp
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.warning("⚠️ Fill all fields");

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      onLogin(res.data.token, res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("✅ Logged in successfully!");
      navigate("/"); // Redirect to TodoApp
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleLogin} autoComplete="off">
=======
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
        <h2>Login</h2>
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
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
=======
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
        </p>
      </form>
    </div>
  );
}
