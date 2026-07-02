import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './WishlistPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/wishlist' } });
      return;
    }
    fetchSavedProperties();
  }, [isAuthenticated]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Please login to view your wishlist');
        setLoading(false);
        return;
      }

      // Try to get saved properties from the API
      const response = await fetch(`${API_URL}/api/properties/user/saved-properties/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedProperties(data);
      } else if (response.status === 404) {
        // If endpoint doesn't exist, try getting all properties and filter
        const allPropertiesRes = await fetch(`${API_URL}/api/properties/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (allPropertiesRes.ok) {
          const allProperties = await allPropertiesRes.json();
          // For now, just show all properties or empty array
          setSavedProperties([]);
        }
      } else if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login', { state: { returnTo: '/wishlist' } });
      } else {
        setError('Failed to load saved properties');
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (propertyId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/properties/${propertyId}/save/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSavedProperties(savedProperties.filter(p => p.id !== propertyId));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const formatZAR = (amount) => {
    if (!amount) return 'Price on request';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    const imgUrl = img.image || img;
    if (!imgUrl) return null;
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL}${imgUrl}`;
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading your saved properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-error">
        <h3>{error}</h3>
        <button onClick={fetchSavedProperties} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved</p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Start saving properties you love!</p>
          <button onClick={() => navigate('/timeline')} className="explore-btn">
            Explore Properties
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {savedProperties.map((property) => (
            <div key={property.id} className="wishlist-card">
              <div className="wishlist-image" onClick={() => navigate(`/property/${property.id}`)}>
                <img 
                  src={getImageUrl(property.images?.[0]) || 'https://placehold.co/400x300/e8e5e1/1a1a1a?text=No+Image'} 
                  alt={property.title} 
                />
                <button 
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(property.id);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="wishlist-info">
                <h4 onClick={() => navigate(`/property/${property.id}`)}>{property.title}</h4>
                <p className="price">{formatZAR(property.monthly_rent)}<span>/month</span></p>
                <p className="location">📍 {property.city}</p>
                <button 
                  className="view-property-btn"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  View Property
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}