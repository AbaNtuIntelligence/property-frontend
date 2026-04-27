// src/lib/api.js
const getApiUrl = () => {
  // For development
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }
  
  // For production (Render)
  if (import.meta.env.PROD) {
    const backendUrl = import.meta.env.VITE_API_URL;
    if (!backendUrl) {
      console.error('VITE_API_URL is not set!');
      return 'https://rental-backend-1-263v.onrender.com';
    }
    // Remove trailing /api if accidentally added
    return backendUrl.replace(/\/api$/, '');
  }
  
  return 'http://localhost:8000';
};

export const apiClient = {
  async request(endpoint, options = {}) {
    const baseUrl = getApiUrl();
    const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Build URL - endpoints should already start with /api/
    let url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
    url = url.replace(/([^:]\/)\/+/g, "$1");
    
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Cannot connect to backend. Please try again.');
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

export default apiClient;