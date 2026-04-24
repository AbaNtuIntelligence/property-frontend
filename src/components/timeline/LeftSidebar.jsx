import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function LeftSidebar({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const getAvatarUrl = (userData) => {
    if (userData?.avatar && userData.avatar !== null) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        if (userData.avatar.startsWith('http')) {
            return userData.avatar;
        }
        return `${API_URL}${userData.avatar}`;
    }
    return `https://ui-avatars.com/api/?background=1877f2&color=fff&name=${encodeURIComponent(userData?.username || 'User')}`;
};

// Use it in the profile avatar:
<img src={getAvatarUrl(user)} alt="Profile" />
  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/`);
      if (response.ok) {
        const data = await response.json();
        // Get properties WITH images first
        const withImages = data.filter(p => p.images && p.images.length > 0);
        const featured = withImages.slice(0, 5);
        setFeaturedProperties(featured);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    const imgUrl = img.image || img;
    if (!imgUrl) return null;
    return imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="left-sidebar">
      {/* Profile Card */}
      <div className="sidebar-card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="profile-info">
            <h3>{user?.username || 'Guest'}</h3>
            <p>{user?.user_type === 'owner' ? 'Property Owner' : 'Property Seeker'}</p>
          </div>
          {user && (
            <button className="logout-icon" onClick={handleLogout} title="Logout">
              🚪
            </button>
          )}
        </div>
        
        {!user && (
          <div className="guest-buttons">
            <Link to="/login" className="guest-login">Login</Link>
            <Link to="/register" className="guest-signup">Sign Up</Link>
          </div>
        )}
      </div>

      {/* Featured Properties - WITH IMAGES */}
      <div className="sidebar-card featured-properties-card">
        <div className="section-title">
          <span className="title-icon">🔥</span>
          <h3>Featured Properties</h3>
          <Link to="/properties" className="see-all">See all</Link>
        </div>

        {loading ? (
          <div className="loading-skeleton">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="empty-state">
            <span>🏠</span>
            <p>No featured properties yet</p>
          </div>
        ) : (
          <div className="featured-list">
            {featuredProperties.map((property, idx) => (
              <div 
                key={property.id} 
                className="featured-item"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className="featured-image">
                  <img 
                    src={getImageUrl(property.images?.[0])} 
                    alt={property.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/60x60/1877f2/white?text=🏠'; }}
                  />
                  <span className="featured-rank">{idx + 1}</span>
                </div>
                <div className="featured-details">
                  <h4>{property.title}</h4>
                  <p className="featured-location">📍 {property.city}</p>
                  <p className="featured-price">{formatZAR(property.monthly_rent)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

{/* Menu Card */}
<div className="sidebar-card menu-card">
    <div className="menu-list">
        <Link to="/timeline" className="menu-link">🏠 Home</Link>
        <Link to="/properties" className="menu-link">🔍 Explore</Link>
        {user?.user_type === 'owner' && (
            <Link to="/property/new" className="menu-link">➕ List Property</Link>
        )}
        <Link to="/wishlist" className="menu-link">❤️ Saved</Link>
    </div>
</div>
      {/* Quick Menu */}
      <div className="sidebar-card menu-card">
        <div className="section-title">
          <span className="title-icon">📱</span>
          <h3>Menu</h3>
        </div>
        <div className="menu-list">
          <Link to="/timeline" className="menu-link">🏠 Home</Link>
          <Link to="/properties" className="menu-link">🔍 Explore</Link>
          {user?.user_type === 'owner' && (
            <Link to="/property/new" className="menu-link">➕ List Property</Link>
          )}
          <Link to="/wishlist" className="menu-link">❤️ Saved</Link>
        </div>
      </div>
    </div>
  );
}