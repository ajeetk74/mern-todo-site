import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.warning("⚠️ Please fill all fields!");

    try {
      await axios.post(`${API_BASE}/auth/register`, { username, password });
      toast.success("🎉 Registration successful! Please login.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>📝 Create Account</h2>
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
          <button type="submit">🚀 Register</button>
          <p>
            Already have an account? <Link to="/login">🔑 Login here</Link>
          </p>
        </form>
      </div>

      {/* ✅ Footer */}
      <footer className="footer">
        © 2025 Made With <span className="heart">❤️</span> MJ. All Rights Reserved.
      </footer>
    </div>
  );
}
