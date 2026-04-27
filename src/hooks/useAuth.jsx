import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const AuthContext = createContext();


const login = async (username, password) => {
  const response = await apiClient.post('/api/accounts/login/', { username, password });
  if (response.key) {
    localStorage.setItem('access_token', response.key);
    return response;
  }
  throw new Error('Login failed');
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user:', error);
            }
        }
        setLoading(false);
    }, []);

    const refreshUser = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return null;
        
        try {
            const response = await fetch(`${API_URL}/api/accounts/profile/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const freshUser = await response.json();
                localStorage.setItem('user', JSON.stringify(freshUser));
                setUser(freshUser);
                return freshUser;
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
        return null;
    };

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/api/accounts/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                return { success: false, error: data.error || 'Login failed' };
            }

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/api/accounts/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                return { success: false, error: data.error || 'Registration failed' };
            }

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}