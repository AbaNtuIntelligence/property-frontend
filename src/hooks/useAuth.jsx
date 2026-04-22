import { useContext, createContext, useState, useEffect } from 'react';
import authService from '../pages/services/authService';


const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const login = async (username, password) => {
  const response = await fetch(`${API_URL}/api/accounts/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Login failed');
  }

  // ✅ Store tokens
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));

  // ✅ Update global state
  setUser(data.user);

  return data;
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}  {/* Just render children, no Router here! */}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}