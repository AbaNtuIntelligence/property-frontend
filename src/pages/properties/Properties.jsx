import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Properties.css';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const searchParams = location.state || {};

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchParams.searchQuery) params.append('search', searchParams.searchQuery);
      if (searchParams.selectedLocation) params.append('city', searchParams.selectedLocation);
      if (searchParams.priceRange) {
        const [min, max] = searchParams.priceRange.split('-');
        if (min) params.append('min_price', min);
        if (max && max !== '+') params.append('max_price', max);
      }
      
      const queryString = params.toString();
      const url = `${API_URL}/api/properties/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        setError('Failed to load properties');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (propertyId) => {
    if (user) {
      navigate(`/property/${propertyId}`);
    } else {
      navigate('/login', { state: { returnTo: `/property/${propertyId}` } });
    }
  };

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="properties-loading">Loading properties...</div>;
  }

  if (error) {
    return <div className="properties-error">{error}</div>;
  }

  return (
    <div className="properties-page">
      <div className="properties-header">
        <h1>All Properties</h1>
        <p>{properties.length} properties found</p>
      </div>
      
      {properties.length === 0 ? (
        <div className="no-properties">
          <p>No properties match your search criteria.</p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="property-card"
              onClick={() => handlePropertyClick(property.id)}
            >
              <div className="property-image">
                {property.images && property.images.length > 0 ? (
                  <img src={property.images[0].image || property.images[0]} alt={property.title} />
                ) : (
                  <div className="no-image">🏠</div>
                )}
              </div>
              <div className="property-info">
                <h3>{property.title}</h3>
                <p className="price">{formatZAR(property.monthly_rent)}/month</p>
                <p className="location">📍 {property.city}</p>
                <div className="details">
                  <span>🛏️ {property.bedrooms} beds</span>
                  <span>🛁 {property.bathrooms} baths</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}