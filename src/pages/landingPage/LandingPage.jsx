import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

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

  const handleExploreClick = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/timeline');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <section className="hero-section">
          <h1>Find Your Perfect Property</h1>
          <p>Discover thousands of properties for rent. Your dream home is waiting.</p>
          <div className="hero-buttons">
            <button onClick={handleExploreClick} className="btn-primary">
              Explore Properties →
            </button>
            <button onClick={() => navigate('/register')} className="btn-secondary">
              List Your Property
            </button>
          </div>
        </section>

        <section className="featured-section">
          <h2>Featured Properties</h2>
          {loading ? (
            <div className="loading-spinner">Loading properties...</div>
          ) : featuredProperties.length === 0 ? (
            <p>No properties available yet.</p>
          ) : (
            <div className="properties-grid">
              {featuredProperties.map(property => (
                <div key={property.id} className="property-card">
                  <div className="property-image">
                    <img 
                      src={property.images?.[0]?.image || 'https://via.placeholder.com/300x200?text=Property'} 
                      alt={property.title}
                    />
                  </div>
                  <div className="property-info">
                    <h3>{property.title}</h3>
                    <p className="price">💰 ${property.monthly_rent}/month</p>
                    <p className="location">📍 {property.city}</p>
                    <button 
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="features-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔍</span>
              <h3>Easy Search</h3>
              <p>Find properties that match your criteria</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Secure Payments</h3>
              <p>Safe and secure transaction process</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🏠</span>
              <h3>Verified Listings</h3>
              <p>All properties are verified by our team</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💬</span>
              <h3>24/7 Support</h3>
              <p>We're here to help you anytime</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}