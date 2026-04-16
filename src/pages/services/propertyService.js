// src/pages/services/propertyService.js
import apiClient from './apiClient';

class PropertyService {
  async getAllProperties(params = {}) {
    return apiClient.get('/api/properties/', params);
  }

  async getPropertyById(id) {
    return apiClient.get(`/api/properties/${id}/`);
  }

  async createProperty(propertyData) {
    return apiClient.post('/api/properties/', propertyData);
  }

  async updateProperty(id, propertyData) {
    return apiClient.put(`/api/properties/${id}/`, propertyData);
  }

  async deleteProperty(id) {
    return apiClient.delete(`/api/properties/${id}/`);
  }

  async searchProperties(query) {
    return apiClient.get('/api/properties/search/', { q: query });
  }
}

export default new PropertyService();