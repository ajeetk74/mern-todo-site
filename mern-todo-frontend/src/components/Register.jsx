import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/auth/register`, { username, email, password });
      toast.success("✅ Registration successful! Please login.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
