import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './OwnerDashboard.css';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('properties');
  
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, monthly: 0, pending: 0 });
  const [analytics, setAnalytics] = useState({ views: 0, inquiries: 0, bookings: 0 });
  
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
    occupation: '',
    company: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.full_name || user.fullName || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        occupation: user.occupation || '',
        company: user.company || ''
      });
      setAvatarPreview(user.avatar_url || user.avatarUrl || null);
    }
    loadOwnerData();
  }, [user]);

  const loadOwnerData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const [propertiesRes, bookingsRes, earningsRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/api/owner/properties/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/owner/bookings/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/owner/earnings/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/owner/analytics/`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (propertiesRes.ok) setProperties(await propertiesRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (earningsRes.ok) setEarnings(await earningsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error('Error loading owner data:', err);
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
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('You must be logged in');

      const updateData = {
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        location: profileForm.location,
        bio: profileForm.bio,
        occupation: profileForm.occupation,
        company: profileForm.company
      };
      
      Object.keys(updateData).forEach(key => {
        if (!updateData[key]) delete updateData[key];
      });
      
      const response = await fetch(`${API_URL}/api/accounts/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      const userResponse = await fetch(`${API_URL}/api/accounts/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
      }
    } catch (err) {
      setError(err.message);
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
      if (!token) throw new Error('You must be logged in');
      
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
      
      if (!response.ok) throw new Error('Failed to change password');
      
      setSuccess('Password updated successfully!');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateProperty = () => {
    navigate('/create-property');
  };

  // SVG Icons
  const IconHome = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  );

  const IconCalendar = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const IconWallet = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8h20" />
      <path d="M14 16h.01" />
    </svg>
  );

  const IconChart = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );

  const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="avatar-large">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {profileForm.fullName?.charAt(0) || user?.email?.charAt(0) || 'O'}
              </div>
            )}
          </div>
          <h3>{profileForm.fullName || user?.full_name || 'Owner'}</h3>
          <p>{user?.email}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <IconHome /> My Properties
            <span className="badge">{properties.length}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <IconCalendar /> Bookings
            <span className="badge">{bookings.filter(b => b.status === 'pending').length}</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            <IconWallet /> Earnings
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <IconChart /> Analytics
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <IconUser /> Profile Settings
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <IconLock /> Security
          </button>
        </nav>
        
        <button onClick={handleLogout} className="logout-btn">
          <IconLogout /> Logout
        </button>
      </aside>
      
      {/* Main Content */}
      <main className="dashboard-main">
        {success && (
          <div className="alert success">
            <IconCheck /> {success}
          </div>
        )}
        {error && (
          <div className="alert error">
            <IconError /> {error}
          </div>
        )}
        
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>My Properties</h2>
              <button onClick={handleCreateProperty} className="create-btn">
                <IconPlus /> List New Property
              </button>
            </div>
            
            {properties.length === 0 ? (
              <div className="empty-state">
                <p>You haven't listed any properties yet</p>
                <button onClick={handleCreateProperty} className="explore-btn">
                  List Your First Property
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.map(property => (
                  <div key={property.id} className="property-card">
                    <img src={property.image} alt={property.title} />
                    <div className="property-info">
                      <h4>{property.title}</h4>
                      <p>R{property.price}/month</p>
                      <div className="property-actions">
                        <button className="edit-btn"><IconEdit /> Edit</button>
                        <button className="delete-btn"><IconTrash /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="tab-content">
            <h2>Bookings</h2>
            {bookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings yet</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking, index) => (
                  <div key={index} className="booking-card">
                    <div className="booking-info">
                      <h4>{booking.propertyTitle}</h4>
                      <p>{booking.renter} • {booking.dates}</p>
                      <span className={`status ${booking.status}`}>{booking.status}</span>
                    </div>
                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <>
                          <button className="accept-btn">Accept</button>
                          <button className="reject-btn">Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="tab-content">
            <h2>Earnings</h2>
            <div className="earnings-summary">
              <div className="earning-card total">
                <h3>Total Earnings</h3>
                <p>R{earnings.total.toLocaleString()}</p>
              </div>
              <div className="earning-card monthly">
                <h3>This Month</h3>
                <p>R{earnings.monthly.toLocaleString()}</p>
              </div>
              <div className="earning-card pending">
                <h3>Pending</h3>
                <p>R{earnings.pending.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <h2>Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Views</h3>
                <p>{analytics.views.toLocaleString()}</p>
              </div>
              <div className="analytics-card">
                <h3>Inquiries</h3>
                <p>{analytics.inquiries}</p>
              </div>
              <div className="analytics-card">
                <h3>Bookings</h3>
                <p>{analytics.bookings}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Tab - Same as seeker but with company field */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Profile Settings</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-section">
                <label>Profile Picture</label>
                <div className="avatar-upload-section">
                  <div className="avatar-preview-large">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" />
                    ) : (
                      <div className="avatar-placeholder-large">
                        {profileForm.fullName?.charAt(0) || 'O'}
                      </div>
                    )}
                  </div>
                  <label className="upload-btn">
                    <IconCamera />
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
              
              <div className="form-section">
                <label>Company / Agency</label>
                <input
                  type="text"
                  name="company"
                  value={profileForm.company}
                  onChange={handleProfileChange}
                  placeholder="Your company or agency name"
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
                  placeholder="Tell us about your properties and services..."
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
        
        {/* Security Tab - Same as seeker */}
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
      </main>
    </div>
  );
}