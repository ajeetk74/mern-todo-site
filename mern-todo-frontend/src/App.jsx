import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import TodoApp from "./components/TodoApp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  // Toggle between login and register pages
  const toggleAuthPage = () => setShowRegister(!showRegister);

  if (!token) {
    return (
      <div className="auth-container">
        <h1>📋 MERN Todo App</h1>
        {showRegister ? (
          <>
            <Register toggleAuthPage={toggleAuthPage} />
            <p className="toggle-text">
              Already have an account?{" "}
              <span className="toggle-link" onClick={toggleAuthPage}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <Login setToken={setToken} setUser={setUser} />
            <p className="toggle-text">
              Don't have an account?{" "}
              <span className="toggle-link" onClick={toggleAuthPage}>
                Register
              </span>
            </p>
          </>
        )}
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  return <TodoApp token={token} user={user} handleLogout={handleLogout} />;
}

export default App;
