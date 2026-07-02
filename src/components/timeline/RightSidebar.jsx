import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebars.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ===== SVG ICONS =====
const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 8v11" />
    <path d="M21 8v11" />
    <rect x="3" y="6" width="18" height="6" rx="2" />
    <circle cx="8" cy="11" r="1" />
    <circle cx="16" cy="11" r="1" />
  </svg>
);

const BathIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M8 20v-4" />
    <path d="M16 20v-4" />
    <path d="M3 14h18" />
    <path d="M6 6a3 3 0 0 1 6 0" />
    <path d="M6 10V6" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function RightSidebar() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/properties/featured/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const data = await response.json();
        setFeaturedProperties(data);
      } else {
        setFeaturedProperties([]);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ FIXED: Handle both string and object image types
  const getImageUrl = (image) => {
    if (!image) return null;
    
    // If it's an object with an image property (like { image: 'url.jpg' })
    if (typeof image === 'object' && image.image) {
      const imgUrl = image.image;
      if (imgUrl.startsWith('http')) return imgUrl;
      return `${API_URL}${imgUrl}`;
    }
    
    // If it's a string
    if (typeof image === 'string') {
      if (image.startsWith('http')) return image;
      return `${API_URL}${image}`;
    }
    
    // Fallback for arrays
    if (Array.isArray(image) && image.length > 0) {
      return getImageUrl(image[0]);
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="right-sidebar">
        <div className="sidebar-card">
          <div className="loading-spinner-small"></div>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>Loading featured properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="right-sidebar">
      {/* Featured Properties */}
      <div className="sidebar-card featured-card">
        <div className="sidebar-card-header">
          <h3>
            <HeartIcon />
            Featured Properties
          </h3>
          <Link to="/properties?featured=true" className="see-all">View All</Link>
        </div>
        {featuredProperties.length > 0 ? (
          <div className="featured-list">
            {featuredProperties.slice(0, 3).map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="featured-item">
                <div className="featured-image-wrapper">
                  <img 
                    src={getImageUrl(property.images?.[0]) || 'https://placehold.co/80x80/e8e5e1/1a1a1a?text=Property'} 
                    alt={property.title}
                    className="featured-image"
                  />
                  <span className="featured-badge">Featured</span>
                </div>
                <div className="featured-info">
                  <h4>{property.title}</h4>
                  <p className="featured-location">
                    <MapPinIcon />
                    {property.city || 'South Africa'}
                  </p>
                  <div className="featured-specs">
                    <span><BedIcon /> {property.bedrooms || '?'}</span>
                    <span><BathIcon /> {property.bathrooms || '?'}</span>
                  </div>
                  <span className="featured-price">{formatZAR(property.monthly_rent)}/month</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-featured">
            <p>No featured properties yet</p>
            <Link to="/owner/properties" className="feature-cta">
              Feature your property
            </Link>
          </div>
        )}
      </div>

      {/* Ad Space */}
      <div className="sidebar-card ad-card premium">
        <div className="ad-badge">Sponsored</div>
        <div className="ad-content">
          <div className="ad-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <span className="ad-label">Premium Listing</span>
          <h4>Get Featured</h4>
          <p>Boost your property visibility</p>
          <button className="ad-button">Learn More →</button>
        </div>
      </div>

      {/* Second Ad */}
      <div className="sidebar-card ad-card standard">
        <div className="ad-badge">Promoted</div>
        <div className="ad-content">
          <h4>Travel Insurance</h4>
          <p>From R99/day. Cancel anytime.</p>
          <button className="ad-button">Learn More →</button>
        </div>
      </div>
    </div>
  );
}