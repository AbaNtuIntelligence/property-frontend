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
    zip_code: '',
    state: '',
    amenities: [],
    pet_friendly: false,
    furnished: false,
    parking: false,
    has_inverter: false,
    has_jojo_tank: false,
    parking_type: 'off_street',
    whatsapp_number: '',
    room_dimensions: {
      living_room: { length: '', width: '' },
      master_bedroom: { length: '', width: '' },
      bedroom_2: { length: '', width: '' },
      bedroom_3: { length: '', width: '' },
      kitchen: { length: '', width: '' },
      dining_room: { length: '', width: '' },
      study: { length: '', width: '' }
    },
    total_area: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoomDimensionChange = (room, field, value) => {
    setFormData(prev => ({
      ...prev,
      room_dimensions: {
        ...prev.room_dimensions,
        [room]: {
          ...prev.room_dimensions[room],
          [field]: value
        }
      }
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

      const filteredRoomDimensions = {};
      Object.entries(formData.room_dimensions).forEach(([room, dims]) => {
        if (dims.length && dims.width) {
          filteredRoomDimensions[room] = dims;
        }
      });

      const propertyData = {
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        monthly_rent: parseFloat(formData.monthly_rent),
        address: formData.address,
        city: formData.city,
        zip_code: formData.zip_code,
        state: formData.state,
        amenities: formData.amenities,
        pet_friendly: formData.pet_friendly,
        furnished: formData.furnished,
        parking: formData.parking,
        has_inverter: formData.has_inverter,
        has_jojo_tank: formData.has_jojo_tank,
        parking_type: formData.parking_type,
        whatsapp_number: formData.whatsapp_number,
        room_dimensions: Object.keys(filteredRoomDimensions).length > 0 ? filteredRoomDimensions : null,
        total_area: formData.total_area || null
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

  // Room configurations - No emojis
  const rooms = [
    { id: 'living_room', label: 'Living Room', icon: 'sofa' },
    { id: 'master_bedroom', label: 'Master Bedroom', icon: 'crown' },
    { id: 'bedroom_2', label: 'Bedroom 2', icon: 'bed' },
    { id: 'bedroom_3', label: 'Bedroom 3', icon: 'bed' },
    { id: 'kitchen', label: 'Kitchen', icon: 'kitchen' },
    { id: 'dining_room', label: 'Dining Room', icon: 'dining' },
    { id: 'study', label: 'Study / Office', icon: 'study' }
  ];

  // SVG Icons
  const RoomIcon = ({ type }) => {
    const icons = {
      sofa: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8v11" /><path d="M21 8v11" /><rect x="3" y="6" width="18" height="6" rx="2" /><circle cx="8" cy="11" r="1" /><circle cx="16" cy="11" r="1" /></svg>,
      crown: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" /></svg>,
      bed: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
      kitchen: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
      dining: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>,
      study: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>,
      camera: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><circle cx="12" cy="12" r="4" /><line x1="17.5" y1="8.5" x2="17.51" y2="8.51" /></svg>,
      upload: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
      inverter: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
      water: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M12 2l7 7M12 2L5 7" /></svg>
    };
    return icons[type] || null;
  };

  return (
    <div className="create-property-container">
      <div className="create-property-card">
        <div className="form-header">
          <h1>List Your Property</h1>
          <p>Fill out the details below to list your property for rent</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Property Title <span className="required">*</span></label>
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
              <label>Description <span className="required">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your property in detail..."
                required
              />
            </div>


          {/* ✅ FEATURED TOGGLE - Add this section */}
          <div className="form-section">
            <h3>Listing Visibility</h3>
            <div className="featured-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="toggle-label">
                <strong>Feature this property</strong>
                <p>Featured properties appear in the "Featured" section on the timeline</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/timeline')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating...' : 'List Property'}
            </button>
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
              <label>Monthly Rent (R) <span className="required">*</span></label>
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
              <label>Street Address <span className="required">*</span></label>
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
                <label>City <span className="required">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
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

          {/* SA Specific Features - Load Shedding & Water Backup */}
          <div className="form-section">
            <h3>Backup & Utilities</h3>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="has_inverter" checked={formData.has_inverter} onChange={handleChange} />
                <RoomIcon type="inverter" />
                Inverter / Battery Backup
              </label>
              <label>
                <input type="checkbox" name="has_jojo_tank" checked={formData.has_jojo_tank} onChange={handleChange} />
                <RoomIcon type="water" />
                JoJo Tank / Water Backup
              </label>
            </div>
          </div>

          {/* Parking */}
          <div className="form-section">
            <h3>Parking</h3>
            <div className="form-group">
              <select name="parking_type" value={formData.parking_type} onChange={handleChange}>
                <option value="off_street">Off-street parking</option>
                <option value="covered">Covered parking</option>
                <option value="garage">Garage</option>
                <option value="secure">Secure parking bay</option>
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="e.g., 0712345678"
              />
              <small>This number will be visible to potential renters. Include your country code (e.g., 27 for South Africa).</small>
            </div>
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

          {/* Room Dimensions */}
          <div className="form-section">
            <h3>Room Dimensions</h3>
            <p className="section-subtitle">Enter the length and width of each room in meters</p>
            <div className="room-dimensions-grid">
              {rooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-card-header">
                    <RoomIcon type={room.icon} />
                    <h4>{room.label}</h4>
                  </div>
                  <div className="dimension-inputs">
                    <div className="dimension-field">
                      <label>Length (m)</label>
                      <input
                        type="number"
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        value={formData.room_dimensions[room.id]?.length || ''}
                        onChange={(e) => handleRoomDimensionChange(room.id, 'length', e.target.value)}
                      />
                    </div>
                    <div className="dimension-field">
                      <label>Width (m)</label>
                      <input
                        type="number"
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        value={formData.room_dimensions[room.id]?.width || ''}
                        onChange={(e) => handleRoomDimensionChange(room.id, 'width', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
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
                <RoomIcon type="upload" />
                <span>Click to Upload Images</span>
                <small>Upload up to 10 images (JPG, PNG, WEBP)</small>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/timeline')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating...
                </>
              ) : (
                'List Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}