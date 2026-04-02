const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_URL = `${API_BASE_URL}/properties/`;

class PropertyService {
    getAuthHeader() {
        const token = localStorage.getItem('access_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async getAllProperties() {
        try {
            const response = await fetch(API_URL, {
                headers: this.getAuthHeader()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            
            const data = await response.json();
            console.log('Fetched properties:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error fetching properties:', error);
            return [];
        }
    }

    async getPropertyById(id) {
        try {
            const response = await fetch(`${API_URL}${id}/`, {
                headers: this.getAuthHeader()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch property');
            }
            
            const data = await response.json();
            console.log('Fetched property:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error fetching property:', error);
            throw error;
        }
    }

    async createProperty(propertyData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: this.getAuthHeader(),
                body: JSON.stringify(propertyData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create property');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating property:', error);
            throw error;
        }
    }

    async updateProperty(id, propertyData) {
        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: 'PUT',
                headers: this.getAuthHeader(),
                body: JSON.stringify(propertyData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update property');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    }

    async deleteProperty(id) {
        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: 'DELETE',
                headers: this.getAuthHeader()
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete property');
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting property:', error);
            throw error;
        }
    }

    async getPropertiesByOwner(ownerId) {
        try {
            const response = await fetch(`${API_URL}?owner=${ownerId}`, {
                headers: this.getAuthHeader()
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching properties:', error);
            return [];
        }
    }
}

export default new PropertyService();