import axios from 'axios';
import axiosInstance from './axiosConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/login/`, {
        username,
        password,
      });
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Get user info from the login response
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return { success: true, user: response.data.user };
        }
        
        return { success: true, data: response.data };
      }
      return { success: false, error: 'No access token received' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.error || 'Login failed',
      };
    }
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  async getCurrentUser() {
    try {
      // Fix: Change from /api/user/profile/ to /api/accounts/profile/
      const response = await axiosInstance.get('/api/accounts/profile/');
      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getToken() {
    return localStorage.getItem('access_token');
  }
}

export default new AuthService();