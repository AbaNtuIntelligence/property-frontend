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
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    hasInverter: false,
    petFriendly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const searchParams = location.state || {};

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.propertyType) params.append('property_type', filters.propertyType);
      if (filters.hasInverter) params.append('has_inverter', 'true');
      if (filters.petFriendly) params.append('pet_friendly', 'true');
      
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

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: '',
      hasInverter: false,
      petFriendly: false
    });
  };

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // SVG Icons
  const IconHome = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const IconBed = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8v11" />
      <path d="M21 8v11" />
      <rect x="3" y="6" width="18" height="6" rx="2" />
      <circle cx="8" cy="11" r="1" />
      <circle cx="16" cy="11" r="1" />
    </svg>
  );

  const IconBath = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 20v-4" />
      <path d="M16 20v-4" />
      <path d="M3 14h18" />
      <path d="M6 6a3 3 0 0 1 6 0" />
      <path d="M6 10V6" />
    </svg>
  );

  const IconMapPin = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const IconSearch = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  const IconFilter = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );

  const IconClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const IconInverter = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );

  const IconPet = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a3 3 0 0 0-3 3v1H7a3 3 0 0 0-3 3v1H3a1 1 0 0 0 0 2h1v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7h1a1 1 0 0 0 0-2h-1V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="properties-loading">
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="properties-error">
        <div className="error-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="properties-page">
      {/* Header */}
      <div className="properties-header">
        <div className="header-content">
          <div>
            <h1>All Properties</h1>
            <p>{properties.length} {properties.length === 1 ? 'property' : 'properties'} found</p>
          </div>
          <div className="header-actions">
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <IconFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search properties..."
              />
            </div>
            
            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="City"
              />
            </div>
            
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
              />
            </div>
            
            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="100000"
              />
            </div>
            
            <div className="filter-group">
              <label>Bedrooms</label>
              <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Property Type</label>
              <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa</option>
              </select>
            </div>
            
            <div className="filter-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="hasInverter"
                  checked={filters.hasInverter}
                  onChange={handleFilterChange}
                />
                <IconInverter /> Inverter Backup
              </label>
            </div>
            
            <div className="filter-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="petFriendly"
                  checked={filters.petFriendly}
                  onChange={handleFilterChange}
                />
                <IconPet /> Pet Friendly
              </label>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {properties.length === 0 ? (
        <div className="no-properties">
          <IconHome />
          <h3>No properties found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Back to Home
          </button>
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
                  <img src={property.images[0].image || property.images[0]} alt={property.title} loading="lazy" />
                ) : (
                  <div className="no-image">
                    <IconHome />
                  </div>
                )}
                {property.has_inverter && (
                  <span className="inverter-badge">
                    <IconInverter /> Inverter
                  </span>
                )}
              </div>
              <div className="property-info">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-price">{formatZAR(property.monthly_rent)} <span>/month</span></p>
                <p className="property-location">
                  <IconMapPin /> {property.city}
                </p>
                <div className="property-details">
                  <span>
                    <IconBed /> {property.bedrooms} beds
                  </span>
                  <span>
                    <IconBath /> {property.bathrooms} baths
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}