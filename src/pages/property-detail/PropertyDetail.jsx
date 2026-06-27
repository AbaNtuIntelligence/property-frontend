import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './PropertyDetail.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/properties/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        setError('Property not found');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load property');
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

  const getImageUrl = (image) => {
    if (!image) return null;
    const imgUrl = image.image || image;
    if (!imgUrl) return null;
    return imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;
  };

  const handleWhatsAppContact = () => {
    if (property?.whatsapp_number) {
      const cleanNumber = property.whatsapp_number.replace(/\D/g, '');
      const message = `Hi, I'm interested in your property: ${property.title}`;
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  // SVG Icons
  const IconArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const IconBed = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8v11" />
      <path d="M21 8v11" />
      <rect x="3" y="6" width="18" height="6" rx="2" />
      <circle cx="8" cy="11" r="1" />
      <circle cx="16" cy="11" r="1" />
    </svg>
  );

  const IconBath = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 20v-4" />
      <path d="M16 20v-4" />
      <path d="M3 14h18" />
      <path d="M6 6a3 3 0 0 1 6 0" />
      <path d="M6 10V6" />
    </svg>
  );

  const IconMapPin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const IconInverter = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );

  const IconWater = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M12 2l7 7M12 2L5 7" />
    </svg>
  );

  const IconWhatsApp = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

  const IconUser = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const IconCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const IconRuler = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
  );

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-error">
        <div className="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Property Not Found</h2>
        <p>Sorry, we couldn't find the property you're looking for.</p>
        <button onClick={() => navigate('/properties')} className="back-btn">
          Browse Properties
        </button>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <div className="property-detail-container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          <IconArrowLeft />
          Back
        </button>

        {/* Image Gallery */}
        <div className="property-gallery">
          <div className="main-image">
            <img 
              src={getImageUrl(property.images?.[selectedImage]) || 'https://placehold.co/800x500/e8e5e1/1a1a1a?text=Property'} 
              alt={property.title}
            />
            {property.has_inverter && (
              <span className="gallery-badge inverter-badge">
                <IconInverter /> Inverter
              </span>
            )}
            {property.has_jojo_tank && (
              <span className="gallery-badge water-badge">
                <IconWater /> JoJo Tank
              </span>
            )}
          </div>
          {property.images && property.images.length > 1 && (
            <div className="thumbnail-grid">
              {property.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={getImageUrl(img)} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="property-content">
          <div className="property-main">
            <h1 className="property-title">{property.title}</h1>
            <p className="property-address">
              <IconMapPin /> {property.address}, {property.city}
            </p>

            <div className="property-specs">
              <div className="spec-item">
                <IconBed />
                <span>{property.bedrooms || '?'} Bedrooms</span>
              </div>
              <div className="spec-item">
                <IconBath />
                <span>{property.bathrooms || '?'} Bathrooms</span>
              </div>
              {property.size && (
                <div className="spec-item">
                  <IconRuler />
                  <span>{property.size} m²</span>
                </div>
              )}
            </div>

            <div className="property-price-section">
              <span className="property-price">{formatZAR(property.monthly_rent)}</span>
              <span className="property-price-period">/month</span>
            </div>

            {property.has_inverter && (
              <div className="property-feature-badge">
                <IconInverter /> Inverter Backup
              </div>
            )}

            {/* Description */}
            <div className="property-description">
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="property-amenities">
                <h2>Amenities</h2>
                <div className="amenities-list">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-item">
                      <IconCheck /> {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="property-sidebar">
            <div className="sidebar-card">
              <h3>Contact Owner</h3>
              <div className="owner-info">
                <IconUser />
                <div>
                  <p className="owner-name">{property.owner_username || 'Property Owner'}</p>
                  <p className="owner-label">Property Owner</p>
                </div>
              </div>

              {property.whatsapp_number && (
                <button className="whatsapp-btn" onClick={handleWhatsAppContact}>
                  <IconWhatsApp />
                  Contact on WhatsApp
                </button>
              )}

              <Link to={`/booking/${property.id}`} className="book-btn">
                <IconCalendar />
                Book Now
              </Link>

              <div className="sidebar-details">
                <div className="sidebar-detail">
                  <span>Property ID</span>
                  <span>#{property.id}</span>
                </div>
                <div className="sidebar-detail">
                  <span>Status</span>
                  <span className={`status-text ${property.status || 'available'}`}>
                    {property.status || 'Available'}
                  </span>
                </div>
                <div className="sidebar-detail">
                  <span>Posted</span>
                  <span>{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}