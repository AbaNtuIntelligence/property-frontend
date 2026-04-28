import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './PropertyManager.css';

const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function PropertyManager() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProperty, setEditingProperty] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        monthly_rent: '',
        bedrooms: '',
        bathrooms: '',
        address: '',
        city: '',
        state: '',
        property_type: 'apartment',
        amenities: [],
        pet_friendly: false,
        furnished: false,
        parking: false,
        has_inverter: false,
        has_jojo_tank: false,
        status: 'available',
        whatsapp_number: '' // ADDED: WhatsApp number field
    });

    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);

    const amenitiesList = ['WiFi', 'Pool', 'Gym', 'AC', 'Parking', 'Pet Friendly', 'Furnished', 'Washing Machine'];

    useEffect(() => {
        fetchUserProperties();
    }, []);

    const fetchUserProperties = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/api/properties/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const allProperties = await response.json();
                const userProperties = allProperties.filter(p => p.owner === user?.id);
                setProperties(userProperties);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
            setError('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleListProperty = () => {
        navigate('/property/new');
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            title: property.title || '',
            description: property.description || '',
            monthly_rent: property.monthly_rent || '',
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            address: property.address || '',
            city: property.city || '',
            state: property.state || '',
            property_type: property.property_type || 'apartment',
            amenities: property.amenities || [],
            pet_friendly: property.pet_friendly || false,
            furnished: property.furnished || false,
            parking: property.parking || false,
            has_inverter: property.has_inverter || false,
            has_jojo_tank: property.has_jojo_tank || false,
            status: property.status || 'available',
            whatsapp_number: property.whatsapp_number || '' // ADDED
        });
        setNewImages([]);
        setImagePreviews([]);
        setDeleteImages([]);
        setShowEditModal(true);
    };

    const handleFormChange = (e) => {
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
        setNewImages([...newImages, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const markImageForDeletion = (imageId) => {
        setDeleteImages([...deleteImages, imageId]);
    };

    const handleUpdateProperty = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch(`${API_URL}/api/properties/${editingProperty.id}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                for (const imageId of deleteImages) {
                    await fetch(`${API_URL}/api/properties/images/${imageId}/delete/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }

                if (newImages.length > 0) {
                    const formDataImg = new FormData();
                    newImages.forEach(img => formDataImg.append('images', img));
                    await fetch(`${API_URL}/api/properties/${editingProperty.id}/upload-images/`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formDataImg
                    });
                }

                setMessage('Property updated successfully!');
                setTimeout(() => {
                    setShowEditModal(false);
                    fetchUserProperties();
                }, 1500);
            } else {
                setError('Failed to update property');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch(`${API_URL}/api/properties/${propertyId}/delete/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setMessage('Property deleted successfully');
                setTimeout(() => {
                    setShowDeleteConfirm(null);
                    fetchUserProperties();
                }, 1500);
            } else {
                setError('Failed to delete property');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    // WhatsApp contact function
    const handleWhatsAppContact = (whatsappNumber, propertyTitle) => {
        if (!whatsappNumber) {
            alert('No WhatsApp number provided for this property owner.');
            return;
        }
        
        // Format WhatsApp number (remove spaces, ensure correct format)
        let formattedNumber = whatsappNumber.replace(/\s/g, '');
        if (formattedNumber.startsWith('0')) {
            formattedNumber = '27' + formattedNumber.substring(1);
        }
        if (!formattedNumber.startsWith('27')) {
            formattedNumber = '27' + formattedNumber;
        }
        
        const message = encodeURIComponent(`Hi! I'm interested in your property: ${propertyTitle}. Is it still available?`);
        window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
    };

    if (loading && properties.length === 0) {
        return <div className="property-manager-loading">Loading your properties...</div>;
    }

    return (
        <div className="property-manager">
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {properties.length === 0 ? (
                <div className="no-properties">
                    <span className="no-properties-icon">🏠</span>
                    <h3>No properties yet</h3>
                    <p>You haven't listed any properties. Click below to get started!</p>
                    <button className="list-property-btn" onClick={handleListProperty}>
                        + List Your First Property
                    </button>
                </div>
            ) : (
                <div>
                    <div className="properties-header">
                        <h3>Your Properties</h3>
                        <button className="add-property-btn" onClick={handleListProperty}>
                            + New Property
                        </button>
                    </div>
                    <div className="properties-table-container">
                        <table className="properties-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>WhatsApp</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(property => (
                                    <tr key={property.id}>
                                        <td className="property-image-cell">
                                            {property.images && property.images.length > 0 ? (
                                                <img src={property.images[0].image || property.images[0]} alt={property.title} />
                                            ) : (
                                                <div className="no-image-placeholder-small">🏠</div>
                                            )}
                                        </td>
                                        <td className="property-title-cell">{property.title}</td>
                                        <td>{formatZAR(property.monthly_rent)}</td>
                                        <td>{property.city}</td>
                                        <td>
                                            <span className={`status-badge ${property.status}`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="whatsapp-cell">
                                            {property.whatsapp_number ? (
                                                <button 
                                                    className="whatsapp-contact-btn"
                                                    onClick={() => handleWhatsAppContact(property.whatsapp_number, property.title)}
                                                >
                                                    📱 Contact Owner
                                                </button>
                                            ) : (
                                                <span className="no-whatsapp">Not provided</span>
                                            )}
                                        </td>
                                        <td className="action-buttons">
                                            <button className="edit-btn" onClick={() => handleEdit(property)}>
                                                ✏️ Edit
                                            </button>
                                            <button className="delete-btn" onClick={() => setShowDeleteConfirm(property.id)}>
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingProperty && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Property</h2>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form className="edit-property-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleFormChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Monthly Rent (R)</label>
                                        <input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleFormChange} required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Bedrooms</label>
                                        <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleFormChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Bathrooms</label>
                                        <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleFormChange} step="0.5" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleFormChange} />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleFormChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Province</label>
                                        <input type="text" name="state" value={formData.state} onChange={handleFormChange} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Property Type</label>
                                    <select name="property_type" value={formData.property_type} onChange={handleFormChange}>
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="condo">Condo</option>
                                        <option value="townhouse">Townhouse</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleFormChange}>
                                        <option value="available">Available</option>
                                        <option value="rented">Rented</option>
                                        <option value="maintenance">Under Maintenance</option>
                                    </select>
                                </div>

                                {/* WhatsApp Number Field - ADDED */}
                                <div className="form-group">
                                    <label>WhatsApp Number (for renters to contact you)</label>
                                    <input 
                                        type="tel" 
                                        name="whatsapp_number" 
                                        value={formData.whatsapp_number} 
                                        onChange={handleFormChange}
                                        placeholder="e.g., 0712345678 or +27712345678"
                                    />
                                    <small>This number will be visible to potential renters so they can contact you directly via WhatsApp.</small>
                                </div>

                                <div className="form-group">
                                    <label>Amenities</label>
                                    <div className="amenities-grid">
                                        {amenitiesList.map(amenity => (
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

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" name="has_inverter" checked={formData.has_inverter} onChange={handleFormChange} />
                                            🔋 Inverter
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" name="has_jojo_tank" checked={formData.has_jojo_tank} onChange={handleFormChange} />
                                            💧 JoJo Tank
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" name="pet_friendly" checked={formData.pet_friendly} onChange={handleFormChange} />
                                            🐾 Pet Friendly
                                        </label>
                                    </div>
                                </div>

                                {/* Current Images */}
                                {editingProperty.images && editingProperty.images.length > 0 && (
                                    <div className="form-group">
                                        <label>Current Images</label>
                                        <div className="current-images">
                                            {editingProperty.images.map((img, idx) => (
                                                <div key={idx} className="current-image">
                                                    <img src={img.image || img} alt={`Image ${idx + 1}`} />
                                                    <button type="button" className="remove-image-btn" onClick={() => markImageForDeletion(img.id)}>
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images Upload */}
                                <div className="form-group">
                                    <label>Add New Images</label>
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                                    <div className="new-images-preview">
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="new-image-preview">
                                                <img src={preview} alt="Preview" />
                                                <button type="button" onClick={() => removeNewImage(idx)}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="button" className="save-btn" onClick={handleUpdateProperty} disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            
        </div>
    );
}