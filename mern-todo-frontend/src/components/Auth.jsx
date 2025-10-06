import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://mern-todo-site-aef3.onrender.com";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return toast.warning("⚠️ All fields are required");
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const res = await axios.post(
        `${API_BASE}${endpoint}`,
        { username: username.trim(), password: password.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user, token);

      toast.success(
        isRegister ? "✅ Registered successfully!" : "✅ Logged in!"
      );

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
        <h1>{isRegister ? "📝 Register" : "🔑 Login"}</h1>
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
            {loading
              ? "⏳ Please wait..."
              : isRegister
              ? "Register ✅"
              : "Login 🔑"}
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
    </div>
  );
}
