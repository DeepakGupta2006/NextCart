import axios from "axios";

// Locally: no VITE_API_URL is set, so it uses "/api" (Vite forwards it to localhost:5000).
// On Vercel: VITE_API_URL is your Render backend URL, so it calls that directly.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nextcart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
