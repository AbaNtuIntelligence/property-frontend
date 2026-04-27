import React, { createContext, useState, useEffect, useContext } from 'react'; // Add useContext
import API, { refreshCsrfToken } from '../api/axios';

export const AuthContext = createContext();

// Add this custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  // ... keep all your existing code exactly as is ...
  // (The rest of your provider code remains unchanged)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for stored user session
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First, try to get a fresh CSRF token
      await refreshCsrfToken();
      
      // Then check if user is authenticated via session/token
      const response = await API.get('/api/dj-rest-auth/user/');
      setUser(response.data);
    } catch (error) {
      // Not authenticated or session expired
      setUser(null);
      // Clear any stale tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      
      // CRITICAL: Refresh CSRF token before login (especially after logout)
      await refreshCsrfToken();
      
      // Use dj-rest-auth login endpoint
      const response = await API.post('/api/dj-rest-auth/login/', { 
        email, 
        password 
      });
      
      // Store tokens if your backend returns them
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      
      // Get user data
      const userResponse = await API.get('/api/dj-rest-auth/user/');
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.non_field_errors?.[0] || error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      // Refresh CSRF token before registration
      await refreshCsrfToken();
      
      // Format data for dj-rest-auth registration
      const registrationData = {
        username: userData.username || userData.email,
        email: userData.email,
        password1: userData.password,
        password2: userData.password,
        ...userData
      };
      
      const response = await API.post('/api/dj-rest-auth/registration/', registrationData);
      
      // Store tokens if returned
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      
      // Log the user in after registration
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      // Extract meaningful error messages
      let errorMessage = 'Registration failed';
      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.username) errorMessage = errors.username[0];
        else if (errors.email) errorMessage = errors.email[0];
        else if (errors.password1) errorMessage = errors.password1[0];
        else if (errors.non_field_errors) errorMessage = errors.non_field_errors[0];
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear session on server
      await API.post('/api/dj-rest-auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token'); // Remove old token if exists
      setUser(null);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await API.patch('/api/dj-rest-auth/user/', userData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  };

  // Helper to refresh token manually if needed
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;
    
    try {
      const response = await API.post('/api/token/refresh/', {
        refresh: refreshToken,
      });
      localStorage.setItem('access_token', response.data.access);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      updateUser,
      refreshToken,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}