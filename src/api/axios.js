import axios from "axios";
import { refreshToken } from "./auth.api"; // ✅ fixed



const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for debugging
API.interceptors.request.use(request => {
  console.log('🚀 API Request:', request.url);
  return request;
});

// Add a response interceptor to handle 404s gracefully
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      console.log('⚠️ API endpoint not found (404):', error.config.url);
      // Return a mock response instead of throwing error
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(error);
  }
);

export default API;