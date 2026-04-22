import React, { useState } from 'react';
import './CreateProperty.css';

function CreateProperty() {
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
        state: '',
        amenities: [],
        pet_friendly: false,
        furnished: false,
        parking: false,
    });

    const amenitiesList = ['WiFi', 'AC', 'Heating', 'Washer', 'Dryer', 'Pool', 'Gym', 'Parking'];
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
        setImages([...images, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
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
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // First, create the property
        const propertyData = {
            title: formData.title,
            description: formData.description,
            property_type: formData.property_type,
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseFloat(formData.bathrooms),
            monthly_rent: parseFloat(formData.monthly_rent),
            address: formData.address,
            city: formData.city,
            state: formData.state,
            amenities: formData.amenities,
            pet_friendly: formData.pet_friendly,
            furnished: formData.furnished,
            parking: formData.parking,
            owner_username: user.username
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
            
            // Then upload images if any
            if (images.length > 0) {
                console.log('Uploading images...', images.length);
                const formData = new FormData();
                images.forEach(image => {
                    formData.append('images', image);
                });
                
                const uploadResponse = await fetch(`${API_URL}/api/properties/${propertyId}/upload-images/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (uploadResponse.ok) {
                    console.log('Images uploaded successfully!');
                } else {
                    console.error('Image upload failed:', await uploadResponse.text());
                }
            }
            
            setSuccess('✅ Property listed successfully! Redirecting to timeline...');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            setError(data.error || 'Failed to create property');
        }
    } catch (err) {
        console.error('Error:', err);
        setError('Cannot connect to backend.');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="create-property-container">
            <div className="create-property-form">
                <h1>List Your Property</h1>
                <p>Fill out the details below to list your property for rent</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        
                        <div className="form-group">
                            <label>Property Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Property Type</label>
                                <select name="property_type" value={formData.property_type} onChange={handleChange}>
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="condo">Condo</option>
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
                            <label>Monthly Rent ($) *</label>
                            <input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Location</h2>
                        
                        <div className="form-group">
                            <label>Street Address *</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Amenities</h2>
                        <div className="amenities-grid">
                            {amenitiesList.map(amenity => (
                                <label key={amenity} className="amenity-checkbox">
                                    <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} />
                                    {amenity}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Additional Features</h2>
                        <div className="checkbox-group">
                            <label><input type="checkbox" name="pet_friendly" checked={formData.pet_friendly} onChange={handleChange} /> Pet Friendly</label>
                            <label><input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} /> Furnished</label>
                            <label><input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} /> Parking Available</label>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Property Images</h2>
                        <div className="image-upload-area">
                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} id="image-upload" />
                            <label htmlFor="image-upload" className="upload-label">📸 Click to Upload Images</label>
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

                    <div className="form-actions">
                        <button type="button" onClick={() => window.location.href = '/'} className="cancel-btn">
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

export default CreateProperty;