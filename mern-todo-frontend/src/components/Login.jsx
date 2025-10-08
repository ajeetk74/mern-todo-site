import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.warning("⚠️ Please fill all fields!");

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });

      localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin(res.data.user, res.data.token);

      toast.success("🎉 Logged in successfully!");
      navigate("/"); // Redirect to TodoApp
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Login failed!");
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>🔐 Welcome Back!</h2>
          <input
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">🚀 Login</button>
          <p>
            Don’t have an account? <Link to="/register">📝 Register here</Link>
          </p>
        </form>
      </div>

      {/* ✅ Footer */}
      <footer className="footer">
        © 2025 Made With <span className="heart">❤️</span> MJ • All Rights Reserved.
      </footer>
    </div>
  );
}
