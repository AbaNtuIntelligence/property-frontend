import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';
import './Right-Sidebar.css';

const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function RightSidebar({ user }) {
  const navigate = useNavigate();
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchTrendingProperties();
  }, []);

  const fetchTrendingProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/`);
      if (response.ok) {
        const data = await response.json();
        // Get properties WITH images first, then sort by price (highest first as trending)
        const withImages = data.filter(p => p.images && p.images.length > 0);
        const trending = withImages.slice(0, 5);
        setTrendingProperties(trending);
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

  return (
    <div className="right-sidebar">
      {/* Welcome Card */}
      {!user && (
        <div className="sidebar-card welcome-card">
          <div className="welcome-emoji">🇿🇦</div>
          <h3>Find Your Home</h3>
          <p>Thousands of properties across SA</p>
          <div className="welcome-buttons">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Trending Properties - WITH IMAGES */}
      <div className="sidebar-card trending-card">
        <div className="section-title">
          <span className="title-icon">📈</span>
          <h3>Trending Now</h3>
          <Link to="/properties" className="see-all">See all</Link>
        </div>

        {loading ? (
          <div className="loading-skeleton">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-trending"></div>
            ))}
          </div>
        ) : trendingProperties.length === 0 ? (
          <div className="empty-state">
            <span>🔥</span>
            <p>No trending properties yet</p>
          </div>
        ) : (
          <div className="trending-list">
            {trendingProperties.map((property, idx) => (
              <div 
                key={property.id} 
                className="trending-item"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className="trending-rank">{idx + 1}</div>
                <div className="trending-image">
                  <img 
                    src={getImageUrl(property.images?.[0])} 
                    alt={property.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/50x50/28a745/white?text=🏠'; }}
                  />
                </div>
                <div className="trending-info">
                  <h4>{property.title}</h4>
                  <p className="trending-location">📍 {property.city}</p>
                  <p className="trending-price">{formatZAR(property.monthly_rent)}</p>
                </div>
                <div className="trending-hot">🔥</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="sidebar-card filters-card">
        <div className="section-title">
          <span className="title-icon">🎯</span>
          <h3>Quick Filters</h3>
        </div>
        <div className="filters-grid">
          <button className="filter-pill" onClick={() => navigate('/search?price=0-10000')}>
            Under R10k
          </button>
          <button className="filter-pill" onClick={() => navigate('/search?bedrooms=2')}>
            2+ Bedrooms
          </button>
          <button className="filter-pill" onClick={() => navigate('/search?amenity=inverter')}>
            🔋 Inverter
          </button>
          <button className="filter-pill" onClick={() => navigate('/search?pet=true')}>
            🐾 Pet Friendly
          </button>
        </div>
      </div>

      {/* Tip Card */}
      <div className="sidebar-card tip-card">
        <div className="tip-emoji">💡</div>
        <h4>Pro Tip</h4>
        <p>Properties with clear photos get <strong>3x more inquiries</strong></p>
        <button className="tip-action" onClick={() => navigate('/property/new')}>
          List Your Property →
        </button>
      </div>
    </div>
  );
}