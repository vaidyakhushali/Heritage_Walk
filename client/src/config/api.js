// Centralized API Base URL configuration
// In local dev with Vite proxy, '/api' proxies to http://localhost:5000/api
// In production on Vercel/Render, VITE_API_URL can be set to e.g. https://heritagewalk-api.onrender.com/api
export const API_URL = (
  import.meta.env.VITE_API_URL || '/api'
).replace(/\/$/, '')
