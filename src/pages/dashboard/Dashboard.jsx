import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PropertyManager from '../../components/property/PropertyManager';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    user_type: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        
        // Update localStorage and auth context
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

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleExploreProperties = () => navigate('/timeline');
  const handleListProperty = () => navigate('/property/new');
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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
      // Update profile
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

        // Upload avatar if changed
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
            updatedUser.avatar = avatarData.avatar_url;
            if (avatarData.avatar_url) {
              setImagePreview(avatarData.avatar_url.startsWith('http') 
                ? avatarData.avatar_url 
                : `${API_URL}${avatarData.avatar_url}`);
            }
          }
        }

        // Update localStorage and state
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

  const getAvatarUrl = () => {
    if (imagePreview) return imagePreview;
    if (profileData.avatar) {
      return profileData.avatar.startsWith('http') 
        ? profileData.avatar 
        : `${API_URL}${profileData.avatar}`;
    }
    return null;
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

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </button>
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          👤 Manage Profile
        </button>
        {profileData.user_type === 'owner' && (
          <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
            🏠 My Properties
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
            
            <div className="dashboard-card">
              <div className="card-icon">💬</div>
              <h3>Messages</h3>
              <p>Communicate with potential renters</p>
              <button className="card-btn">View Messages →</button>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon">❤️</div>
              <h3>Saved Properties</h3>
              <p>View your saved properties</p>
              <button className="card-btn">View Saved →</button>
            </div>
          </div>
        )}

        {/* Manage Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Manage Profile</h2>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleUpdateProfile} className="profile-form">
              {/* Profile Image */}
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
                    {profileImage && (
                      <button type="button" className="cancel-upload" onClick={() => {
                        setProfileImage(null);
                        setImagePreview(profileData.avatar ? `${API_URL}${profileData.avatar}` : null);
                      }}>
                        Cancel
                      </button>
                    )}
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

        {/* My Properties Tab - Only for Owners */}
        {activeTab === 'properties' && profileData.user_type === 'owner' && (
          <PropertyManager />
        )}
      </div>
    </div>
  );
};

export default Dashboard;