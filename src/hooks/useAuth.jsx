import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const AuthContext = createContext(null);

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

            if (!response.ok) {
                return { success: false, error: data.detail || data.error || 'Login failed' };
            }

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

    const register = async (email, password, userData) => {
        try {
            const response = await fetch(`${API_URL}/api/accounts/registration/`, {
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
            
            const data = await response.json();
            
            if (!response.ok) {
                const errorMsg = data.detail || Object.values(data)[0]?.[0] || 'Registration failed';
                throw new Error(errorMsg);
            }
            
            if (data.key) {
                localStorage.setItem('access_token', data.key);
                localStorage.setItem('user', JSON.stringify({ email, username: data.user?.username }));
                setUser({ email, username: data.user?.username });
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