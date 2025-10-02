import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("✅ Login successful!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
  );
}
