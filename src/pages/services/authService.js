// Property Rental Frontend/src/pages/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/accounts/';

class AuthService {
    async login(username, password) {
        try {
            const response = await axios.post(API_URL + 'login/', {
                username,
                password
            });
            if (response.data.access) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async register(userData) {
        try {
            const response = await axios.post(API_URL + 'register/', userData);
            if (response.data.access) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }
}

export default new AuthService();