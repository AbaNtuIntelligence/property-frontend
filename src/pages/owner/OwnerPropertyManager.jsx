import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './OwnerPropertyManager.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function OwnerPropertyManager() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    bedrooms: '',
    bathrooms: '',
    monthly_rent: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    status: 'available',
    has_inverter: false,
    has_jojo_tank: false,
    pet_friendly: false,
    furnished: false,
    parking: false,
    parking_type: 'off_street',
    amenities: [],
    whatsapp_number: '',
    is_featured: false,
    room_dimensions: {
      living_room: { length: '', width: '' },
      master_bedroom: { length: '', width: '' },
      bedroom_2: { length: '', width: '' },
      bedroom_3: { length: '', width: '' },
      kitchen: { length: '', width: '' },
      dining_room: { length: '', width: '' },
      study: { length: '', width: '' }
    },
    total_area: '',
    existingImages: [],
    newImages: [],
    imagePreviews: []
  });

  const amenitiesList = [
    'WiFi', 'Pool', 'Gym', 'Parking', 'Pet Friendly', 
    'Furnished', 'Air Conditioning', 'Heating', 'Garden',
    'Balcony', 'Security', 'Backup Power', 'Water Backup'
  ];

  useEffect(() => {
    fetchOwnerProperties();
  }, []);

  const fetchOwnerProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/properties/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const allProperties = await response.json();
        // Filter properties by owner
        const userProperties = allProperties.filter(p => p.owner_username === user?.username);
        setProperties(userProperties);
      } else {
        setError('Failed to load properties');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    
    const roomDimensions = property.room_dimensions || {
      living_room: { length: '', width: '' },
      master_bedroom: { length: '', width: '' },
      bedroom_2: { length: '', width: '' },
      bedroom_3: { length: '', width: '' },
      kitchen: { length: '', width: '' },
      dining_room: { length: '', width: '' },
      study: { length: '', width: '' }
    };

    const existingImages = property.images?.map(img => ({
      id: img.id || Math.random(),
      url: img.image || img
    })) || [];

    setEditFormData({
      title: property.title || '',
      description: property.description || '',
      property_type: property.property_type || 'apartment',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      monthly_rent: property.monthly_rent || '',
      address: property.address || '',
      city: property.city || '',
      state: property.state || '',
      zip_code: property.zip_code || '',
      status: property.status || 'available',
      has_inverter: property.has_inverter || false,
      has_jojo_tank: property.has_jojo_tank || false,
      pet_friendly: property.pet_friendly || false,
      furnished: property.furnished || false,
      parking: property.parking || false,
      parking_type: property.parking_type || 'off_street',
      amenities: property.amenities || [],
      whatsapp_number: property.whatsapp_number || '',
      is_featured: property.is_featured || false,
      room_dimensions: roomDimensions,
      total_area: property.total_area || '',
      existingImages: existingImages,
      newImages: [],
      imagePreviews: []
    });

    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoomDimensionChange = (room, field, value) => {
    setEditFormData(prev => ({
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
    setEditFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      setError('Please upload valid image files');
      return;
    }

    setEditFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...validFiles],
      imagePreviews: [
        ...prev.imagePreviews,
        ...validFiles.map(file => URL.createObjectURL(file))
      ]
    }));
    setError('');
  };

  const removeExistingImage = (imageId) => {
    setEditFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img.id !== imageId)
    }));
  };

  const removeNewImage = (index) => {
    setEditFormData(prev => {
      const newImages = [...prev.newImages];
      const imagePreviews = [...prev.imagePreviews];
      newImages.splice(index, 1);
      imagePreviews.splice(index, 1);
      return { ...prev, newImages, imagePreviews };
    });
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in');
        setUploading(false);
        return;
      }

      const propertyData = {
        title: editFormData.title,
        description: editFormData.description,
        property_type: editFormData.property_type,
        bedrooms: parseInt(editFormData.bedrooms) || 0,
        bathrooms: parseFloat(editFormData.bathrooms) || 0,
        monthly_rent: parseFloat(editFormData.monthly_rent) || 0,
        address: editFormData.address,
        city: editFormData.city,
        state: editFormData.state,
        zip_code: editFormData.zip_code,
        status: editFormData.status,
        has_inverter: editFormData.has_inverter,
        has_jojo_tank: editFormData.has_jojo_tank,
        pet_friendly: editFormData.pet_friendly,
        furnished: editFormData.furnished,
        parking: editFormData.parking,
        parking_type: editFormData.parking_type,
        amenities: editFormData.amenities,
        whatsapp_number: editFormData.whatsapp_number,
        is_featured: editFormData.is_featured,
        room_dimensions: editFormData.room_dimensions,
        total_area: editFormData.total_area || null
      };

      const response = await fetch(`${API_URL}/api/properties/${editingProperty.id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      // Upload new images
      if (editFormData.newImages.length > 0) {
        const imageFormData = new FormData();
        editFormData.newImages.forEach(image => {
          imageFormData.append('images', image);
        });

        await fetch(`${API_URL}/api/properties/${editingProperty.id}/upload-images/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: imageFormData
        });
      }

      setSuccess('Property updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      setShowEditModal(false);
      fetchOwnerProperties();
      
    } catch (err) {
      setError(err.message || 'Failed to update property');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProperty = (propertyId) => {
    setShowDeleteConfirm(propertyId);
  };

  const confirmDeleteProperty = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/properties/${showDeleteConfirm}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== showDeleteConfirm));
        setSuccess('Property deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete property');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const toggleFeatured = async (propertyId, currentStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/properties/${propertyId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_featured: !currentStatus })
      });

      if (response.ok) {
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, is_featured: !currentStatus } : p
        ));
        setSuccess(`Property ${!currentStatus ? 'featured' : 'unfeatured'} successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to toggle featured status');
    }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    const url = img.url || img.image || img;
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${API_URL}${url}`;
  };

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="property-manager-loading">
        <div className="loading-spinner"></div>
        <p>Loading your properties...</p>
      </div>
    );
  }

  return (
    <div className="property-manager-container">
      <div className="property-manager-header">
        <h1>My Properties</h1>
        <Link to="/property/new" className="add-property-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          List New Property
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {properties.length === 0 ? (
        <div className="no-properties">
          <div className="no-properties-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3>No properties yet</h3>
          <p>You haven't listed any properties. Click below to get started!</p>
          <Link to="/property/new" className="list-property-btn">
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="properties-list">
          {properties.map(property => (
            <div key={property.id} className="property-item">
              {/* Property Image */}
              <div className="property-image-small">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={getImageUrl(property.images[0])} 
                    alt={property.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/80x80/e8e5e1/1a1a1a?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="no-image-small">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                )}
                {/* Featured Badge */}
                {property.is_featured && (
                  <span className="featured-badge">Featured</span>
                )}
              </div>

              {/* Property Details */}
              <div className="property-details">
                <h3>{property.title}</h3>
                <p className="property-price">{formatZAR(property.monthly_rent)}<span>/month</span></p>
                <p className="property-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.city || 'Location not set'}
                </p>
                <div className="property-status">
                  <span className={`status-badge ${property.status || 'available'}`}>
                    {property.status || 'available'}
                  </span>
                  {property.has_inverter && (
                    <span className="inverter-badge">Inverter</span>
                  )}
                </div>
              </div>

              {/* Property Actions */}
              <div className="property-actions">
                {/* Featured Toggle Button */}
                <button 
                  className={`feature-toggle-btn ${property.is_featured ? 'active' : ''}`}
                  onClick={() => toggleFeatured(property.id, property.is_featured)}
                >
                  {property.is_featured ? '★ Featured' : '☆ Feature'}
                </button>
                
                {/* Edit Button */}
                <button className="edit-property-btn" onClick={() => handleEditProperty(property)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                
                {/* View Button */}
                <button className="view-property-btn" onClick={() => navigate(`/property/${property.id}`)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View
                </button>
                
                {/* Delete Button */}
                <button className="delete-property-btn" onClick={() => handleDeleteProperty(property.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProperty && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Property</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="property-actions">
  {/* ✅ ADD FEATURED TOGGLE BUTTON HERE */}
  <button 
    className={`feature-toggle-btn ${property.is_featured ? 'active' : ''}`}
    onClick={() => toggleFeatured(property.id, property.is_featured)}
  >
    {property.is_featured ? '★ Featured' : '☆ Feature'}
  </button>
  
  <button className="edit-property-btn" onClick={() => handleEditProperty(property)}>
    Edit
  </button>
  <button className="view-property-btn" onClick={() => navigate(`/property/${property.id}`)}>
    View
  </button>
  <button className="delete-property-btn" onClick={() => handleDeleteProperty(property.id)}>
    Delete
  </button>
</div>
            <div className="modal-body">
              <form onSubmit={handleUpdateProperty} className="edit-property-form">
                {/* Basic Information */}
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      rows="4"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Property Type</label>
                      <select name="property_type" value={editFormData.property_type} onChange={handleEditFormChange}>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" value={editFormData.status} onChange={handleEditFormChange}>
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Under Maintenance</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bedrooms</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={editFormData.bedrooms}
                        onChange={handleEditFormChange}
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Bathrooms</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={editFormData.bathrooms}
                        onChange={handleEditFormChange}
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div className="form-group">
                      <label>Monthly Rent (R) *</label>
                      <input
                        type="number"
                        name="monthly_rent"
                        value={editFormData.monthly_rent}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="form-section">
                  <h3>Location</h3>
                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Province</label>
                      <input
                        type="text"
                        name="state"
                        value={editFormData.state}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="zip_code"
                        value={editFormData.zip_code}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="form-section">
                  <h3>Listing Visibility</h3>
                  <div className="featured-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={editFormData.is_featured}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev,
                          is_featured: e.target.checked
                        }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="toggle-label">
                      <strong>Feature this property</strong>
                      <p>Featured properties appear in the "Featured" section on the timeline</p>
                    </div>
                  </div>
                </div>

                {/* South African Features */}
                <div className="form-section">
                  <h3>South African Features</h3>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="has_inverter"
                        checked={editFormData.has_inverter}
                        onChange={handleEditFormChange}
                      />
                      Inverter Backup
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="has_jojo_tank"
                        checked={editFormData.has_jojo_tank}
                        onChange={handleEditFormChange}
                      />
                      JoJo Tank
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="pet_friendly"
                        checked={editFormData.pet_friendly}
                        onChange={handleEditFormChange}
                      />
                      Pet Friendly
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="furnished"
                        checked={editFormData.furnished}
                        onChange={handleEditFormChange}
                      />
                      Furnished
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="parking"
                        checked={editFormData.parking}
                        onChange={handleEditFormChange}
                      />
                      Parking Available
                    </label>
                  </div>
                  {editFormData.parking && (
                    <div className="form-group">
                      <label>Parking Type</label>
                      <select name="parking_type" value={editFormData.parking_type} onChange={handleEditFormChange}>
                        <option value="off_street">Off-street</option>
                        <option value="covered">Covered</option>
                        <option value="garage">Garage</option>
                        <option value="secure">Secure Bay</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="form-section">
                  <h3>Contact Information</h3>
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp_number"
                      value={editFormData.whatsapp_number}
                      onChange={handleEditFormChange}
                      placeholder="e.g., 0712345678"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="form-section">
                  <h3>Amenities</h3>
                  <div className="amenities-grid-edit">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="amenity-checkbox">
                        <input
                          type="checkbox"
                          checked={editFormData.amenities.includes(amenity)}
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
                  <div className="room-dimensions-grid-edit">
                    {Object.entries(editFormData.room_dimensions).map(([room, dims]) => {
                      const roomLabels = {
                        living_room: 'Living Room',
                        master_bedroom: 'Master Bedroom',
                        bedroom_2: 'Bedroom 2',
                        bedroom_3: 'Bedroom 3',
                        kitchen: 'Kitchen',
                        dining_room: 'Dining Room',
                        study: 'Study / Office'
                      };
                      return (
                        <div key={room} className="room-dimension-edit">
                          <label>{roomLabels[room]}</label>
                          <div className="dimension-inputs">
                            <input
                              type="number"
                              placeholder="Length (m)"
                              value={dims.length}
                              onChange={(e) => handleRoomDimensionChange(room, 'length', e.target.value)}
                              step="0.1"
                              min="0"
                            />
                            <input
                              type="number"
                              placeholder="Width (m)"
                              value={dims.width}
                              onChange={(e) => handleRoomDimensionChange(room, 'width', e.target.value)}
                              step="0.1"
                              min="0"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="form-group">
                    <label>Total Area (m²)</label>
                    <input
                      type="number"
                      name="total_area"
                      value={editFormData.total_area}
                      onChange={handleEditFormChange}
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="form-section">
                  <h3>Images</h3>
<div className="property-image-small">
  {property.images && property.images.length > 0 ? (
    <img 
      src={getImageUrl(property.images[0])} 
      alt={property.title}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/80x80/e8e5e1/1a1a1a?text=No+Image';
      }}
    />
  ) : (
    <div className="no-image-small">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </div>
  )}
  {property.is_featured && (
    <span className="featured-badge">Featured</span>
  )}
</div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={uploading}>
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this property? This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowDeleteConfirm(null)}>
                  Cancel
                </button>
                <button className="delete-confirm-btn" onClick={confirmDeleteProperty}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}