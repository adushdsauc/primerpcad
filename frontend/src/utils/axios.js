import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  console.log("🔥 Base URL:", process.env.REACT_APP_API_URL);
  withCredentials: true, // ✅ this is required
});

export default api;
