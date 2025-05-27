import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  withCredentials: true, // ✅ this is required
    console.log("🔥 Base URL:", process.env.REACT_APP_API_URL);
});

export default api;
