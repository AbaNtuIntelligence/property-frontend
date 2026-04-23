import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './CreateProperty.css';

export default function CreateProperty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    monthly_rent: '',
    address: '',
    city: '',
    zip_code: '',  // ZIP CODE ADDED HERE
    state: '',
    amenities: [],
    pet_friendly: false,
    furnished: false,
    parking: false,
    has_inverter: false,
    has_jojo_tank: false,
    parking_type: 'off_street'
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setError('Only image files are allowed');
      return;
    }
    
    setImages([...images, ...validFiles]);
    
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.monthly_rent || !formData.address || !formData.city) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        monthly_rent: parseFloat(formData.monthly_rent),
        address: formData.address,
        city: formData.city,
        zip_code: formData.zip_code,  // ZIP CODE INCLUDED HERE
        state: formData.state,
        amenities: formData.amenities,
        pet_friendly: formData.pet_friendly,
        furnished: formData.furnished,
        parking: formData.parking,
        has_inverter: formData.has_inverter,
        has_jojo_tank: formData.has_jojo_tank,
        parking_type: formData.parking_type
      };

      const response = await fetch(`${API_URL}/api/properties/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      const data = await response.json();

      if (response.ok) {
        const propertyId = data.id;
        
        if (images.length > 0) {
          const formDataImages = new FormData();
          images.forEach(image => {
            formDataImages.append('images', image);
          });
          
          await fetch(`${API_URL}/api/properties/${propertyId}/upload-images/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formDataImages
          });
        }
        
        setSuccess('Property listed successfully! Redirecting...');
        setTimeout(() => {
          navigate('/timeline');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create property');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-property-container">
      <div className="create-property-card">
        <h1>List Your Property</h1>
        <p>Fill out the details below to list your property for rent</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Beautiful 2-Bedroom Apartment"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your property..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Property Type</label>
                <select name="property_type" value={formData.property_type} onChange={handleChange}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" step="0.5" />
              </div>
            </div>

            <div className="form-group">
              <label>Monthly Rent (R) *</label>
              <input
                type="number"
                name="monthly_rent"
                value={formData.monthly_rent}
                onChange={handleChange}
                placeholder="e.g., 15000"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h3>Location</h3>
            
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              {/* ZIP CODE FIELD - ADDED HERE */}
              <div className="form-group">
                <label>ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="e.g., 2000, 8001"
                />
              </div>

              <div className="form-group">
                <label>Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Gauteng"
                />
              </div>
            </div>
          </div>

          {/* SA Specific Features */}
          <div className="form-section">
            <h3>🇿🇦 Load Shedding & Water Backup</h3>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="has_inverter" checked={formData.has_inverter} onChange={handleChange} />
                🔋 Inverter / Battery Backup
              </label>
              <label>
                <input type="checkbox" name="has_jojo_tank" checked={formData.has_jojo_tank} onChange={handleChange} />
                💧 JoJo Tank / Water Backup
              </label>
            </div>
          </div>

          {/* Parking */}
          <div className="form-section">
            <h3>Parking</h3>
            <select name="parking_type" value={formData.parking_type} onChange={handleChange}>
              <option value="off_street">Off-street parking</option>
              <option value="covered">Covered parking</option>
              <option value="garage">Garage</option>
              <option value="secure">Secure parking bay</option>
            </select>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {['WiFi', 'Pool', 'Gym', 'Pet Friendly', 'Furnished', 'Parking'].map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <h3>Property Images</h3>
            <div className="image-upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                📸 Click to Upload Images
              </label>
              <p className="upload-hint">Upload up to 10 images (JPG, PNG)</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index}`} />
                    <button type="button" onClick={() => removeImage(index)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/timeline')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating...' : 'List Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}