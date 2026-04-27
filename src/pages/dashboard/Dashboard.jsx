import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    user_type: ''
  });
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [propertiesFetched, setPropertiesFetched] = useState(false);
  
  // Edit/Delete states
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    monthly_rent: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    status: 'available',
    has_inverter: false
  });
  
  const fetchRef = useRef(false);

  // Fetch fresh user data on mount
  const loadUserData = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/accounts/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const freshUser = await response.json();
        setProfileData({
          username: freshUser.username || '',
          email: freshUser.email || '',
          phone_number: freshUser.phone_number || '',
          first_name: freshUser.first_name || '',
          last_name: freshUser.last_name || '',
          user_type: freshUser.user_type || ''
        });

        if (freshUser.avatar) {
          const avatarUrl = freshUser.avatar.startsWith('http') 
            ? freshUser.avatar 
            : `${API_URL}${freshUser.avatar}`;
          setImagePreview(avatarUrl);
        }
        
        localStorage.setItem('user', JSON.stringify(freshUser));
        if (refreshUser) await refreshUser();
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setFetchingUser(false);
    }
  }, [navigate, refreshUser]);

  // Fetch properties only once when needed
  const fetchMyProperties = useCallback(async () => {
    if (fetchRef.current) return;
    fetchRef.current = true;
    
    setLoadingProperties(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${API_URL}/api/properties/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const allProperties = await response.json();
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userProperties = allProperties.filter(p => p.owner_username === currentUser.username);
        setMyProperties(userProperties);
        setPropertiesFetched(true);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (activeTab === 'properties' && profileData.user_type === 'owner' && !propertiesFetched && !fetchRef.current) {
      fetchMyProperties();
    }
  }, [activeTab, profileData.user_type, propertiesFetched, fetchMyProperties]);

  // Navigation handlers
  const handleExploreProperties = () => navigate('/timeline');
  const handleListProperty = () => navigate('/property/new');
  const handleViewProperty = (propertyId) => navigate(`/property/${propertyId}`);
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Profile handlers
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    try {
      if (profileImage) {
        const formData = new FormData();
        formData.append('avatar', profileImage);
        
        const avatarResponse = await fetch(`${API_URL}/api/accounts/upload-avatar/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          if (avatarData.avatar_url) {
            setImagePreview(avatarData.avatar_url.startsWith('http') ? avatarData.avatar_url : `${API_URL}${avatarData.avatar_url}`);
          }
          setProfileImage(null);
        }
      }
      
      const response = await fetch(`${API_URL}/api/accounts/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
          phone_number: profileData.phone_number,
          first_name: profileData.first_name,
          last_name: profileData.last_name
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileData(prev => ({ ...prev, ...updatedUser }));
        if (refreshUser) await refreshUser();
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Property CRUD handlers
  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setEditFormData({
      title: property.title || '',
      description: property.description || '',
      monthly_rent: property.monthly_rent || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      address: property.address || '',
      city: property.city || '',
      status: property.status || 'available',
      has_inverter: property.has_inverter || false
    });
    setShowEditModal(true);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${API_URL}/api/properties/${editingProperty.id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editFormData,
          monthly_rent: parseFloat(editFormData.monthly_rent),
          bedrooms: parseInt(editFormData.bedrooms),
          bathrooms: parseFloat(editFormData.bathrooms)
        })
      });
      
      if (response.ok) {
        const updatedProperty = await response.json();
        setMyProperties(myProperties.map(p => 
          p.id === updatedProperty.id ? updatedProperty : p
        ));
        setShowEditModal(false);
        setEditingProperty(null);
        setMessage('Property updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Failed to update property');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = (propertyId) => {
    setShowDeleteConfirm(propertyId);
  };

  const confirmDeleteProperty = async () => {
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${API_URL}/api/properties/${showDeleteConfirm}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setMyProperties(myProperties.filter(p => p.id !== showDeleteConfirm));
        setShowDeleteConfirm(null);
        setMessage('Property deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Failed to delete property');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const getAvatarUrl = () => {
    if (imagePreview) return imagePreview;
    if (profileData.avatar) {
      return profileData.avatar.startsWith('http') 
        ? profileData.avatar 
        : `${API_URL}${profileData.avatar}`;
    }
    return null;
  };

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
    }).format(amount);
  };

  if (fetchingUser) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard, {profileData.first_name || profileData.username}! 👋</h1>
        <div className="dashboard-actions">
          <button onClick={handleExploreProperties} className="btn-explore">
            🔍 Explore Properties
          </button>
          {profileData.user_type === 'owner' && (
            <button onClick={handleListProperty} className="btn-list">
              📝 List Property
            </button>
          )}
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </button>
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          👤 Manage Profile
        </button>
        {profileData.user_type === 'owner' && (
          <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
            🏠 My Properties ({myProperties.length})
          </button>
        )}
      </div>

      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="dashboard-card" onClick={handleExploreProperties}>
              <div className="card-icon">🏠</div>
              <h3>Explore Properties</h3>
              <p>Browse through thousands of available properties</p>
              <button className="card-btn">Start Exploring →</button>
            </div>
            
            {profileData.user_type === 'owner' && (
              <div className="dashboard-card" onClick={handleListProperty}>
                <div className="card-icon">📝</div>
                <h3>List Your Property</h3>
                <p>Reach thousands of potential tenants</p>
                <button className="card-btn">List Now →</button>
              </div>
            )}
            
            {profileData.user_type === 'owner' && (
              <div className="dashboard-card" onClick={() => setActiveTab('properties')}>
                <div className="card-icon">📊</div>
                <h3>My Properties</h3>
                <p>View and manage your listed properties</p>
                <button className="card-btn">Manage →</button>
              </div>
            )}
          </div>
        )}

        {/* Manage Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Manage Profile</h2>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group avatar-group">
                <label>Profile Picture</label>
                <div className="avatar-upload">
                  <div className="avatar-preview-large">
                    {getAvatarUrl() ? (
                      <img src={getAvatarUrl()} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {profileData.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="avatar-upload-buttons">
                    <label className="upload-btn">
                      📸 Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <p className="upload-hint">JPEG, PNG, GIF up to 5MB</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={handleProfileChange}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleProfileChange}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleProfileChange}
                  placeholder="+27 XX XXX XXXX"
                />
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <input
                  type="text"
                  value={profileData.user_type === 'owner' ? '🏠 Property Owner' : '🔍 Property Seeker'}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Properties Tab */}
        {activeTab === 'properties' && profileData.user_type === 'owner' && (
          <div className="my-properties-section">
            <div className="properties-header">
              <h2>My Properties</h2>
              <button onClick={handleListProperty} className="add-property-btn">
                + Add New Property
              </button>
            </div>
            
            {loadingProperties ? (
              <div className="loading-properties">Loading your properties...</div>
            ) : myProperties.length === 0 ? (
              <div className="no-properties">
                <span>🏠</span>
                <h3>No properties yet</h3>
                <p>You haven't listed any properties. Click below to get started!</p>
                <button onClick={handleListProperty} className="list-property-btn">
                  List Your First Property
                </button>
              </div>
            ) : (
              <div className="properties-list">
                {myProperties.map(property => (
                  <div key={property.id} className="property-item">
                    <div className="property-image-small">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0].image || property.images[0]} alt={property.title} />
                      ) : (
                        <div className="no-image-small">🏠</div>
                      )}
                    </div>
                    <div className="property-details">
                      <h3>{property.title}</h3>
                      <p className="property-price">{formatZAR(property.monthly_rent)}<span>/month</span></p>
                      <p className="property-location">📍 {property.city}</p>
                      <div className="property-status">
                        <span className={`status-badge ${property.status || 'available'}`}>
                          {property.status || 'available'}
                        </span>
                      </div>
                    </div>
                    <div className="property-actions">
                      <button className="edit-property-btn" onClick={() => handleEditProperty(property)}>
                        ✏️ Edit
                      </button>
                      <button className="delete-property-btn" onClick={() => handleDeleteProperty(property.id)}>
                        🗑️ Delete
                      </button>
                      <button className="view-property-btn" onClick={() => handleViewProperty(property.id)}>
                        👁️ View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Property Modal */}
      {showEditModal && editingProperty && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Property</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateProperty} className="edit-property-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Rent (R)</label>
                    <input
                      type="number"
                      value={editFormData.monthly_rent}
                      onChange={(e) => setEditFormData({...editFormData, monthly_rent: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input
                      type="number"
                      value={editFormData.bedrooms}
                      onChange={(e) => setEditFormData({...editFormData, bedrooms: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editFormData.bathrooms}
                      onChange={(e) => setEditFormData({...editFormData, bathrooms: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
                
                <div className="form-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={editFormData.has_inverter}
                      onChange={(e) => setEditFormData({...editFormData, has_inverter: e.target.checked})}
                    />
                    🔋 Inverter Backup
                  </label>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>×</button>
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