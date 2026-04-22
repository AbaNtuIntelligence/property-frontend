import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ImageSlider from '../../components/timeline/ImageSlider';
import './Timeline.css';

export default function Timeline() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    
    try {
      const url = `${API_URL}/api/properties/`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Properties loaded:', data);
      setProperties(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>❌ Error: {error}</p>
        <button onClick={fetchProperties}>Retry</button>
      </div>
    );
  }

  return (
    <div className="timeline-layout">
      {/* Left Sidebar */}
      <div className="left-sidebar">
        <div className="sidebar-card">
          <h3>Menu</h3>
          <ul>
            <li>🏠 Home</li>
            <li>🔍 Explore</li>
            <li>📋 Properties</li>
            <li>❤️ Saved</li>
          </ul>
        </div>
        {user?.user_type === 'owner' && (
          <div className="sidebar-card">
            <button 
              onClick={() => window.location.href = '/property/new'}
              style={{
                width: '100%',
                padding: '10px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              + List New Property
            </button>
          </div>
        )}
      </div>

      {/* Main Timeline Feed */}
      <div className="timeline-container">
        <div className="posts-feed">
          {properties.length === 0 ? (
            <div className="no-posts">
              <p>🏠 No properties found.</p>
              {user?.user_type === 'owner' && (
                <button onClick={() => window.location.href = '/property/new'}>
                  List Your First Property
                </button>
              )}
            </div>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="timeline-post">
                {/* Property Images - Image Slider */}
                {property.images && property.images.length > 0 && (
                  <ImageSlider images={property.images} propertyTitle={property.title} />
                )}
                
                <div className="post-header">
                  <div className="post-owner-info">
                    <h4>{property.title}</h4>
                    <span className="post-location">{property.city}, {property.state || ''}</span>
                  </div>
                </div>
                
                <div className="post-content">
                  <p className="property-price">💰 ${property.monthly_rent}/month</p>
                  <p className="property-description">{property.description}</p>
                  <div className="property-features">
                    <span>🛏️ {property.bedrooms || 1} beds</span>
                    <span>🛁 {property.bathrooms || 1} baths</span>
                    <span>📍 {property.city}</span>
                  </div>
                </div>
                
                <div className="post-actions">
                  <button>❤️ Like</button>
                  <button>💬 Comment</button>
                  <button>🔗 Share</button>
                  <button>📖 Save</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <div className="sidebar-card">
          <h3>📊 Statistics</h3>
          <p>Total Listings: <strong>{properties.length}</strong></p>
        </div>
      </div>
    </div>
  );
}