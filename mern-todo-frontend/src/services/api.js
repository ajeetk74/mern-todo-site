import axios from "axios";

// Base URL of backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Add a request interceptor to include JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

<<<<<<< HEAD
export default api;
=======
export default api;
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
