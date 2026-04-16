// src/pages/services/authService.js
import axios from 'axios';
import axiosInstance from './axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, {
        username,
        password,
      });
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Get user info
        const userInfo = await this.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        return { success: true, data: response.data, user: userInfo };
      }
      return { success: false, error: 'No access token received' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
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
      const response = await axiosInstance.get('/api/user/profile/');
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