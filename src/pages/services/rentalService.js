// src/pages/services/rentalService.js
import apiClient from './apiClient';

class RentalService {
  async getAllRentals(params = {}) {
    return apiClient.get('/api/rentals/', params);
  }

  async getRentalById(id) {
    return apiClient.get(`/api/rentals/${id}/`);
  }

  async createRental(rentalData) {
    return apiClient.post('/api/rentals/', rentalData);
  }

  async updateRental(id, rentalData) {
    return apiClient.put(`/api/rentals/${id}/`, rentalData);
  }

  async deleteRental(id) {
    return apiClient.delete(`/api/rentals/${id}/`);
  }

  async getMyRentals() {
    return apiClient.get('/api/rentals/my-rentals/');
  }
}

export default new RentalService();