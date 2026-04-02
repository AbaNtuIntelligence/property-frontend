import authService from './authService';

const API_URL = 'http://127.0.0.1:8000/api/rentals/';

class RentalService {
    getAuthHeader() {
        const token = authService.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async createRental(rentalData) {
        try {
            const response = await fetch(API_URL + 'rentals/', {
                method: 'POST',
                headers: this.getAuthHeader(),
                body: JSON.stringify(rentalData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create rental');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating rental:', error);
            throw error;
        }
    }

    async getUserRentals() {
        try {
            const response = await fetch(API_URL + 'rentals/my_rentals/', {
                headers: this.getAuthHeader()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch rentals');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching rentals:', error);
            return [];
        }
    }

    async getRentalById(id) {
        try {
            const response = await fetch(API_URL + `rentals/${id}/`, {
                headers: this.getAuthHeader()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch rental');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching rental:', error);
            throw error;
        }
    }
}

export default new RentalService();