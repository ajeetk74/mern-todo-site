import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

<<<<<<< HEAD
const API_BASE =
  import.meta.env.VITE_API_URL || "https://mern-todo-site-aef3.onrender.com";
=======
const API_BASE = "https://mern-todo-site-aef3.onrender.com"; // ✅ Deployed backend
>>>>>>> 74dea89 (Updated backend CORS & frontend routing fixes)

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    if (!username.trim() || !password.trim()) {
      return toast.warning("⚠️ All fields are required");
    }

    setLoading(true);
=======
    if (!username.trim() || !password.trim()) return toast.warning("⚠️ All fields required");
>>>>>>> 74dea89 (Updated backend CORS & frontend routing fixes)

    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
<<<<<<< HEAD

      const res = await axios.post(
        `${API_BASE}${endpoint}`,
        { username: username.trim(), password: password.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

=======
      const res = await axios.post(
        `${API_BASE}${endpoint}`,
        { username: username.trim(), password: password.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
>>>>>>> 74dea89 (Updated backend CORS & frontend routing fixes)
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
<<<<<<< HEAD

      onLogin(user, token);

      toast.success(
        isRegister ? "✅ Registered successfully!" : "✅ Logged in!"
      );

=======
      onLogin(user, token);
      toast.success(isRegister ? "✅ Registered!" : "✅ Logged in!");
>>>>>>> 74dea89 (Updated backend CORS & frontend routing fixes)
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
<<<<<<< HEAD
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
=======
          <input type="text" placeholder="Username 👤" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
          <input type="password" placeholder="Password 🔒" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          <button type="submit" disabled={loading}>
            {loading ? "⏳ Please wait..." : isRegister ? "Register ✅" : "Login 🔑"}
>>>>>>> 74dea89 (Updated backend CORS & frontend routing fixes)
          </button>
        </form>
        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span style={{ color: "#7c3aed", cursor: "pointer", fontWeight: "bold" }} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login 🔑" : "Register 📝"}
          </span>
        </p>
      </div>
    </div>
  );
}
