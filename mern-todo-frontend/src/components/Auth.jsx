<<<<<<< HEAD
import React, { useState } from 'react';
import api from '../services/api';

export default function Auth({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const handleRegister = async () => {
    await api.post('/auth/register', { username, password });
    handleLogin();
  };

  return (
    <div>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
=======
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Use the deployed backend URL here:
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://mern-todo-site-aef3.onrender.com";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password)
      return toast.warning("⚠️ All fields required");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const res = await axios.post(`${API_BASE}${endpoint}`, {
        username,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      onLogin(user, token);

      toast.success(
        isRegister
          ? "✅ Registered successfully!"
          : "✅ Logged in!"
      );
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "❌ Authentication failed"
      );
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h1>{isRegister ? "📝 Register" : "🔑 Login"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username 👤"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password 🔒"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {isRegister ? "Register ✅" : "Login 🔑"}
          </button>
        </form>
        <p>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            style={{ color: "#7c3aed", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login 🔑" : "Register 📝"}
          </span>
        </p>
      </div>
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
    </div>
  );
}
