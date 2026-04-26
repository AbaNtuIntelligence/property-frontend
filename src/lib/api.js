// src/lib/api.js
const getApiUrl = () => {
  // For development
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  }
  
  // For production (Netlify)
  if (import.meta.env.PROD) {
    // Use environment variable or relative path
    return import.meta.env.VITE_API_URL || '/api';
  }
  
  return '/api';
};

export const apiClient = {
  async request(endpoint, options = {}) {
    const baseUrl = getApiUrl();
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    
    try {
      // Remove double slashes
      let url = `${baseUrl}${endpoint}`;
      url = url.replace(/([^:]\/)\/+/g, "$1");
      
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || data.error || 'Request failed');
        }
        return data;
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return text;
      }
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  
  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};