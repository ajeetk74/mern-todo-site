import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TodoApp from "./components/TodoApp";
import Auth from "./components/Auth";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    toast.success("✅ Login successful!");
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("ℹ️ Logged out!");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <TodoApp token={token} user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!token ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        {/* Fallback: redirect unknown URLs */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}
