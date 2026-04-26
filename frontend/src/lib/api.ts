import axios, { AxiosInstance } from "axios";

// In dev, leave baseURL empty so the Vite proxy handles /api and /uploads.
// In production, set VITE_API_URL to the backend origin (e.g. https://api.example.com).
const baseURL = import.meta.env.VITE_API_URL || "";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Inject token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API_BASE = baseURL;
