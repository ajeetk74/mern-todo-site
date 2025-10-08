import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Auth({ isRegisterMode = false, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return toast.warning("⚠️ All fields are required");

    setLoading(true);
    try {
      const endpoint = isRegisterMode ? "/auth/register" : "/auth/login";
      const res = await axios.post(`${API_BASE}${endpoint}`, { username, password });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user, token);

      toast.success(isRegisterMode ? "✅ Registered successfully!" : "✅ Logged in!");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Auth Error:", err);
      toast.error(err.response?.data?.message || "❌ Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h1>{isRegisterMode ? "📝 Register" : "🔑 Login"}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username 👤"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password 🔒"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Please wait..." : isRegisterMode ? "Register ✅" : "Login 🔑"}
          </button>
        </form>
      </div>

      {/* ✅ Footer */}
      <footer className="footer">
        © 2025 Made With <span className="heart">❤️</span> MJ. All Rights Reserved.
      </footer>
    </div>
  );
}
