import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchFeaturedProperties();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  // Fetch properties from backend - SAME logic as Timeline
  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/properties/`);
      if (response.ok) {
        const data = await response.json();
        
        // Filter properties with images first - SAME as Timeline
        const withImages = data.filter(p => p.images && p.images.length > 0);
        
        // Take first 6 as featured
        const featured = withImages.slice(0, 6);
        setFeaturedProperties(featured);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format ZAR currency
  const formatZAR = (amount) => {
    if (!amount) return 'Price on request';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get image URL - SAME as Timeline
  const getImageUrl = (img) => {
    if (!img) return null;
    const imgUrl = img.image || img;
    if (!imgUrl) return null;
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL}${imgUrl}`;
  };

  const handleExploreProperties = () => {
    if (isAuthenticated) {
      navigate('/timeline');
    } else {
      navigate('/login', { state: { returnTo: '/timeline' } });
    }
  };

  const handleListProperty = () => {
    if (isAuthenticated) {
      navigate('/property/new');
    } else {
      navigate('/login', { state: { returnTo: '/property/new' } });
    }
  };

  const handlePropertyClick = (propertyId) => {
    if (isAuthenticated) {
      navigate(`/property/${propertyId}`);
    } else {
      navigate('/login', { state: { returnTo: `/property/${propertyId}` } });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let query = '';
    if (searchQuery) query += `q=${encodeURIComponent(searchQuery)}`;
    if (selectedLocation) query += `${query ? '&' : ''}location=${selectedLocation}`;
    if (priceRange) query += `${query ? '&' : ''}price=${priceRange}`;
    if (propertyType) query += `${query ? '&' : ''}type=${propertyType}`;
    
    if (isAuthenticated) {
      navigate(`/properties?${query}`);
    } else {
      navigate('/login', { state: { returnTo: `/properties?${query}` } });
    }
  };

  const scrollToProperties = () => {
    document.getElementById('featured-properties')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🏆</span>
            <span>#1 Property Rental Platform 2026</span>
          </div>
          
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Dream Property</span>
          </h1>
          <p className="hero-subtitle">
            Discover thousands of rental properties across South Africa
          </p>
          
          {/* Search Bar */}
          <form className="hero-search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-input-group">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by city, address, or suburb..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="search-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="cape-town">🌊 Cape Town</option>
                <option value="johannesburg">🏙️ Johannesburg</option>
                <option value="durban">🌴 Durban</option>
                <option value="pretoria">🏛️ Pretoria</option>
                <option value="port-elizabeth">⚓ Port Elizabeth</option>
              </select>
              <select 
                className="search-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Property Type</option>
                <option value="apartment">🏢 Apartment</option>
                <option value="house">🏠 House</option>
                <option value="condo">🏙️ Condo</option>
                <option value="townhouse">🏘️ Townhouse</option>
              </select>
              <select 
                className="search-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="0-5000">R0 - R5,000</option>
                <option value="5000-10000">R5,000 - R10,000</option>
                <option value="10000-15000">R10,000 - R15,000</option>
                <option value="15000-20000">R15,000 - R20,000</option>
                <option value="20000-30000">R20,000 - R30,000</option>
                <option value="30000-50000">R30,000 - R50,000</option>
                <option value="50000+">R50,000+</option>
              </select>
              <button type="submit" className="search-btn">
                🔍 Search
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="hero-buttons">
            <button onClick={handleExploreProperties} className="hero-btn primary">
              <span>Explore Properties</span>
              <span className="btn-arrow">→</span>
            </button>
            <button onClick={handleListProperty} className="hero-btn secondary">
              <span>+ List Your Property</span>
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Properties</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>5,000+</h3>
              <p>Happy Renters</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>Satisfaction Rate</p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <button className="scroll-indicator" onClick={scrollToProperties}>
            <span>View Properties</span>
            <span className="scroll-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="featured-properties" className="featured-properties-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <p>Hand-picked properties just for you</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="empty-state">
              <p>No properties available yet.</p>
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {featuredProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="property-card"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <div className="property-image-wrapper">
                      <img 
                        src={getImageUrl(property.images?.[0]) || 'https://placehold.co/400x250/1a472a/white?text=🏠'} 
                        alt={property.title}
                        className="property-image"
                        onError={(e) => e.target.src = 'https://placehold.co/400x250/1a472a/white?text=🏠'}
                      />
                      <span className="featured-badge">Featured</span>
                    </div>
                    <div className="property-info">
                      <h3 className="property-title">{property.title}</h3>
                      <p className="property-location">📍 {property.city || 'South Africa'}</p>
                      <div className="property-details">
                        <span>🛏️ {property.bedrooms || '?'} beds</span>
                        <span>🛁 {property.bathrooms || '?'} baths</span>
                        <span>📐 {property.size || '?'} m²</span>
                      </div>
                      <div className="property-footer">
                        <p className="property-price">
                          {formatZAR(property.monthly_rent || property.price)}
                          <span>/month</span>
                        </p>
                        <button className="view-btn">View Details →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="view-all-container">
                <button onClick={handleExploreProperties} className="view-all-btn">
                  View All Properties →
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to find your dream property?</h2>
          <p>Join thousands of satisfied renters and property owners</p>
          <div className="cta-buttons">
            <button onClick={handleExploreProperties} className="cta-btn primary">
              Start Exploring
            </button>
            <button onClick={handleListProperty} className="cta-btn secondary">
              List Your Property
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}