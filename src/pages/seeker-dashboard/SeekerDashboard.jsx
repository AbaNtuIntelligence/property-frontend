// src/pages/seeker-dashboard/SeekerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './SeekerDashboard.css';

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // Make sure setUser is available
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
    occupation: ''
  });
  
  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  
  // Saved searches state
  const [savedSearches, setSavedSearches] = useState([]);
  
  // Rental history state
  const [rentalHistory, setRentalHistory] = useState([]);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.full_name || user.fullName || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        occupation: user.occupation || ''
      });
      setAvatarPreview(user.avatar_url || user.avatarUrl || null);
    }
    
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      // Load wishlist
      const wishlistRes = await fetch(`${API_URL}/api/user/wishlist/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (wishlistRes.ok) {
        const data = await wishlistRes.json();
        setWishlist(data || []);
      }
      
      // Load saved searches
      const searchesRes = await fetch(`${API_URL}/api/user/saved-searches/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (searchesRes.ok) {
        const data = await searchesRes.json();
        setSavedSearches(data || []);
      }
      
      // Load rental history
      const historyRes = await fetch(`${API_URL}/api/user/rental-history/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (historyRes.ok) {
        const data = await historyRes.json();
        setRentalHistory(data || []);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

// src/pages/seeker-dashboard/SeekerDashboard.jsx
// Replace your handleUpdateProfile with this

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    const token = localStorage.getItem('access_token');
    
    console.log('Token exists?', !!token);
    
    if (!token) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    // Prepare update data - match your backend field names
    const updateData = {
      full_name: profileForm.fullName,
      phone: profileForm.phone,
      location: profileForm.location,
      bio: profileForm.bio,
      occupation: profileForm.occupation
    };
    
    // Remove empty fields
    Object.keys(updateData).forEach(key => {
      if (!updateData[key] || updateData[key] === '') {
        delete updateData[key];
      }
    });
    
    console.log('Sending update to /api/accounts/profile/');
    console.log('Data:', updateData);
    
    const response = await fetch(`${API_URL}/api/accounts/profile/`, {
      method: 'PATCH',  // or 'PUT' depending on your backend
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Failed to update profile');
    }
    
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
    
    // Refresh user data
    const userResponse = await fetch(`${API_URL}/api/accounts/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      localStorage.setItem('user', JSON.stringify(userData));
      // If you have setUser from useAuth, update it
      if (setUser) setUser(userData);
    }
    
  } catch (err) {
    console.error('Update error:', err);
    setError(err.message || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }
      
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      if (securityForm.newPassword && securityForm.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const response = await fetch(`${API_URL}/api/accounts/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: securityForm.currentPassword,
          new_password: securityForm.newPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to change password');
      }
      
      setSuccess('Password updated successfully!');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Password error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="seeker-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="avatar-large">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {profileForm.fullName?.charAt(0) || user?.email?.charAt(0) || '👤'}
              </div>
            )}
          </div>
          <h3>{profileForm.fullName || user?.full_name || 'User'}</h3>
          <p>{user?.email}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="icon">👤</span> My Profile
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <span className="icon">🔒</span> Security
          </button>
          <button 
            className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span className="icon">❤️</span> Wishlist
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'searches' ? 'active' : ''}`}
            onClick={() => setActiveTab('searches')}
          >
            <span className="icon">🔍</span> Saved Searches
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="icon">📜</span> Rental History
          </button>
        </nav>
        
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </aside>
      
      {/* Main Content */}
      <main className="dashboard-main">
        {success && <div className="success-alert">{success}</div>}
        {error && <div className="error-alert">{error}</div>}
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>My Profile</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-section">
                <label>Profile Picture</label>
                <div className="avatar-upload-section">
                  <div className="avatar-preview-large">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" />
                    ) : (
                      <div className="avatar-placeholder-large">
                        {profileForm.fullName?.charAt(0) || '👤'}
                      </div>
                    )}
                  </div>
                  <label className="upload-btn">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                    Change Photo
                  </label>
                </div>
              </div>
              
              <div className="form-section">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileForm.fullName}
                  onChange={handleProfileChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="form-row">
                <div className="form-section">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="+27 12 345 6789"
                  />
                </div>
                
                <div className="form-section">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                    placeholder="City, Province"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div className="form-section">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={profileForm.occupation}
                  onChange={handleProfileChange}
                  placeholder="e.g., Software Engineer, Student"
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="tab-content">
            <h2>Security Settings</h2>
            <form onSubmit={handleUpdateSecurity} className="security-form">
              <div className="form-section">
                <label>Current Password</label>
                <input
                  type="password"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-section">
                <label>New Password</label>
                <input
                  type="password"
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Minimum 6 characters"
                />
              </div>
              
              <div className="form-section">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your new password"
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
        
        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="tab-content">
            <h2>My Wishlist ❤️</h2>
            {wishlist.length === 0 ? (
              <div className="empty-state">
                <p>Your wishlist is empty</p>
                <button onClick={() => navigate('/properties')} className="explore-btn">
                  Explore Properties
                </button>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(property => (
                  <div key={property.id} className="wishlist-card">
                    <img src={property.image} alt={property.title} />
                    <div className="wishlist-info">
                      <h4>{property.title}</h4>
                      <p>R{property.price}/month</p>
                      <button onClick={() => {/* remove from wishlist */}}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Saved Searches Tab */}
        {activeTab === 'searches' && (
          <div className="tab-content">
            <h2>Saved Searches 🔍</h2>
            {savedSearches.length === 0 ? (
              <div className="empty-state">
                <p>No saved searches yet</p>
              </div>
            ) : (
              <div className="searches-list">
                {savedSearches.map((search, index) => (
                  <div key={index} className="search-card">
                    <div className="search-info">
                      <h4>{search.name}</h4>
                      <p>{search.location}</p>
                    </div>
                    <button className="search-again-btn">Search Again</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Rental History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content">
            <h2>Rental History 📜</h2>
            {rentalHistory.length === 0 ? (
              <div className="empty-state">
                <p>No rental history yet</p>
                <button onClick={() => navigate('/properties')} className="explore-btn">
                  Start Renting
                </button>
              </div>
            ) : (
              <div className="history-list">
                {rentalHistory.map((rental, index) => (
                  <div key={index} className="history-card">
                    <img src={rental.propertyImage} alt={rental.propertyTitle} />
                    <div className="history-info">
                      <h4>{rental.propertyTitle}</h4>
                      <p>{rental.dates}</p>
                      <span className={`status ${rental.status}`}>{rental.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SeekerDashboard;