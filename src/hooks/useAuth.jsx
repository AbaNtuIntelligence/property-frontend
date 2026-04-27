// src/hooks/useAuth.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const AuthContext = createContext();

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

    // SINGLE login function - FIXED
    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/api/accounts/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            // Django dj-rest-auth returns 'key' on success
            if (!response.ok) {
                const errorMsg = data.detail || data.error || 'Login failed';
                return { success: false, error: errorMsg };
            }

            // Handle dj-rest-auth response (returns 'key')
            const token = data.key || data.access;
            
            if (token) {
                localStorage.setItem('access_token', token);
                localStorage.setItem('user', JSON.stringify({ username }));
                setUser({ username });
                return { success: true, user: { username } };
            }
            
            return { success: false, error: 'No token received' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    // SINGLE register/signup function - FIXED
// src/hooks/useAuth.jsx
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const register = async (email, password, userData) => {
  try {
    const url = `${API_BASE}/api/accounts/registration/`;
    console.log('Registering at:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.fullName?.replace(/\s/g, '').toLowerCase() || email.split('@')[0],
        email: email,
        password1: password,
        password2: password,
        first_name: userData.fullName?.split(' ')[0] || '',
        last_name: userData.fullName?.split(' ')[1] || '',
      }),
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.detail || Object.values(data)[0]?.[0] || 'Registration failed');
    }
    
    if (data.key) {
      localStorage.setItem('access_token', data.key);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            refreshUser, 
            loading, 
            isAuthenticated: !!user 
        }}>
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