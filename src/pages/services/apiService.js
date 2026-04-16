// src/pages/services/apiService.js
import apiClient from './apiClient';

class ApiService {
  async fetchData(endpoint) {
    return apiClient.get(endpoint);
  }

  async postData(endpoint, data) {
    return apiClient.post(endpoint, data);
  }

  async updateData(endpoint, data) {
    return apiClient.put(endpoint, data);
  }

  async deleteData(endpoint) {
    return apiClient.delete(endpoint);
  }

  async checkConnection() {
    try {
      const result = await apiClient.get('/api/test/');
      console.log('✅ API Connection successful:', result);
      return { connected: true, data: result };
    } catch (error) {
      console.error('❌ API Connection failed:', error);
      return { connected: false, error };
    }
  }
}

export default new ApiService();