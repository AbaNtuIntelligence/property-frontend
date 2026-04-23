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

  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedProperties(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreProperties = () => {
    if (isAuthenticated) {
      navigate('/timeline');
    } else {
      navigate('/login');
    }
  };

  const handleListProperty = () => {
    // Direct to CreateProperty - login required will be handled by ProtectedRoute
    navigate('/property/new');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let query = '';
    if (searchQuery) query += `q=${encodeURIComponent(searchQuery)}`;
    if (selectedLocation) query += `${query ? '&' : ''}location=${selectedLocation}`;
    if (priceRange) query += `${query ? '&' : ''}price=${priceRange}`;
    if (propertyType) query += `${query ? '&' : ''}type=${propertyType}`;
    
    navigate(`/search?${query}`);
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
            Discover thousands of rental properties, apartments, and homes in your desired location
          </p>
          
          {/* Search Bar */}
          <form className="hero-search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-input-group">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by city, address, or ZIP"
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
                <option value="new-york">🗽 New York</option>
                <option value="los-angeles">🌴 Los Angeles</option>
                <option value="chicago">🌆 Chicago</option>
                <option value="houston">🤠 Houston</option>
                <option value="seattle">☕ Seattle</option>
                <option value="miami">🏖️ Miami</option>
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
                <option value="0-1000">$0 - $1,000</option>
                <option value="1000-2000">$1,000 - $2,000</option>
                <option value="2000-3000">$2,000 - $3,000</option>
                <option value="3000-5000">$3,000 - $5,000</option>
                <option value="5000+">$5,000+</option>
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
      <section id="featured-properties" className="featured-section">
        <div className="section-header">
          <div className="section-tag">Featured Listings</div>
          <h2>Popular Properties</h2>
          <p>Discover the most viewed and loved properties this week</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🏠</span>
            <h3>No properties yet</h3>
            <p>Be the first to list your property!</p>
            <button onClick={handleListProperty} className="empty-btn">List Your Property</button>
          </div>
        ) : (
          <div className="properties-grid">
            {featuredProperties.map((property, index) => (
              <div key={property.id} className="property-card" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card-badge">{index + 1}</div>
                <div className="property-image">
                  <img 
                    src={property.images?.[0]?.image || 'https://placehold.co/400x300/667eea/white?text=Property'} 
                    alt={property.title}
                  />
                  <div className="image-overlay">
                    <button 
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="quick-view"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="property-info">
                  <div className="property-price">${property.monthly_rent}/month</div>
                  <h3>{property.title}</h3>
                  <div className="property-location">
                    <span>📍</span> {property.city}, {property.state || 'USA'}
                  </div>
                  <div className="property-features">
                    <span>🛏️ {property.bedrooms || 2} beds</span>
                    <span>🛁 {property.bathrooms || 2} baths</span>
                    <span>📐 {property.square_feet || 1200} sqft</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="view-details"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="section-footer">
          <button onClick={handleExploreProperties} className="view-all-btn">
            Browse All Properties
            <span className="btn-icon">→</span>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <div className="section-tag">Why Choose Us</div>
            <h2>Experience the Best Property Platform</h2>
            <p>We make property rental simple, secure, and stress-free</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Advanced filters to find your perfect match</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Safe and encrypted transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h3>Verified Listings</h3>
              <p>All properties are verified by our team</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>We're here to help you anytime</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile App</h3>
              <p>Search on the go with our app</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Trusted Reviews</h3>
              <p>Real reviews from real tenants</p>
            </div>
          </div>
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