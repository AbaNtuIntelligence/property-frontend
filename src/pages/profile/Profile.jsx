import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    user_type: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        phone_number: parsedUser.phone_number || '',
        user_type: parsedUser.user_type || ''
      });
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    try {
      const response = await fetch(`${API_URL}/api/accounts/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1>My Profile</h1>
          <p className="user-type-badge">
            {user?.user_type === 'owner' ? '🏠 Property Owner' : '🔍 Property Seeker'}
          </p>
        </div>

        <div className="profile-info">
          {!isEditing ? (
            <>
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{user?.phone_number || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type:</span>
                <span className="info-value">{user?.user_type === 'owner' ? 'Property Owner' : 'Property Seeker'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">{new Date(user?.date_joined || Date.now()).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-actions">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              ✏️ Edit Profile
            </button>
          )}
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {user?.user_type === 'owner' && (
          <div className="profile-owner-actions">
            <button onClick={() => navigate('/property/new')} className="list-property-btn">
              + List New Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
}