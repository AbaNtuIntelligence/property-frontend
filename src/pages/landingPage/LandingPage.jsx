import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  AwardIcon,
  SearchIcon,
  ArrowRightIcon,
  MapPinIcon,
  BedIcon,
  BathIcon,
  RulerIcon,
  ChevronRightIcon,
  ShieldIcon,
  HeartIcon,
  ZapIcon
} from '../../components/icons';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/properties/`);
      if (response.ok) {
        const data = await response.json();
        const withImages = data.filter(p => p.images && p.images.length > 0);
        const featured = withImages.slice(0, 6);
        setFeaturedProperties(featured);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <AwardIcon />
            <span>Premium Property Rental Platform 2026</span>
          </div>
          
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Perfect Stay</span>
          </h1>
          <p className="hero-subtitle">
            Discover exceptional properties across South Africa's most desirable locations
          </p>
          
          {/* Search Bar */}
          <form className="hero-search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-input-group">
                <SearchIcon />
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
                <option value="cape-town">Cape Town</option>
                <option value="johannesburg">Johannesburg</option>
                <option value="durban">Durban</option>
                <option value="pretoria">Pretoria</option>
                <option value="port-elizabeth">Port Elizabeth</option>
              </select>
              <select 
                className="search-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
              <select 
                className="search-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="0-5000">R0 – R5,000</option>
                <option value="5000-10000">R5,000 – R10,000</option>
                <option value="10000-15000">R10,000 – R15,000</option>
                <option value="15000-20000">R15,000 – R20,000</option>
                <option value="20000-30000">R20,000 – R30,000</option>
                <option value="30000-50000">R30,000 – R50,000</option>
                <option value="50000+">R50,000+</option>
              </select>
              <button type="submit" className="search-btn">
                <SearchIcon />
                Search
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="hero-buttons">
            <button onClick={handleExploreProperties} className="hero-btn primary">
              <span>Explore Properties</span>
              <ArrowRightIcon />
            </button>
            <button onClick={handleListProperty} className="hero-btn secondary">
              <span>List Your Property</span>
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
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="featured-properties-section">
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
                        src={getImageUrl(property.images?.[0]) || 'https://placehold.co/400x250/e8e5e1/1a1a1a?text=Property'} 
                        alt={property.title}
                        className="property-image"
                        onError={(e) => e.target.src = 'https://placehold.co/400x250/e8e5e1/1a1a1a?text=Property'}
                      />
                      <span className="featured-badge">Featured</span>
                    </div>
                    <div className="property-info">
                      <h3 className="property-title">{property.title}</h3>
                      <p className="property-location">
                        <MapPinIcon />
                        {property.city || 'South Africa'}
                      </p>
                      <div className="property-details">
                        <span>
                          <BedIcon />
                          {property.bedrooms || '?'}
                        </span>
                        <span>
                          <BathIcon />
                          {property.bathrooms || '?'}
                        </span>
                        <span>
                          <RulerIcon />
                          {property.size || '?'}m²
                        </span>
                      </div>
                      <div className="property-footer">
                        <p className="property-price">
                          {formatZAR(property.monthly_rent || property.price)}
                          <span>/month</span>
                        </p>
                        <button className="view-btn">
                          View Details <ChevronRightIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="view-all-container">
                <button onClick={handleExploreProperties} className="view-all-btn">
                  View All Properties <ArrowRightIcon />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p>Exceptional service, curated properties, and peace of mind</p>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <ShieldIcon />
              </div>
              <h4>Verified Properties</h4>
              <p>Every listing is verified for quality and authenticity</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <HeartIcon />
              </div>
              <h4>Trusted by Thousands</h4>
              <p>Join our community of happy renters and hosts</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <ZapIcon />
              </div>
              <h4>Instant Booking</h4>
              <p>Secure your stay in minutes with our seamless booking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to find your dream property?</h2>
          <p>Join thousands of satisfied renters and property owners</p>
          <div className="cta-buttons">
            <button onClick={handleExploreProperties} className="cta-btn primary">
              Start Exploring <ArrowRightIcon />
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