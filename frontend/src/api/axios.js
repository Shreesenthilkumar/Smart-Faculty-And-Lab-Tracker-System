import axios from "axios";

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// Create a .env file (see .env.example) to point at a different backend.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // Include credentials (cookies, auth headers) in cross-origin requests
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ft_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 almost always means the token expired or was rejected — clear it
// and bounce to the login page rather than showing a confusing error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("ft_token");
      localStorage.removeItem("ft_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
