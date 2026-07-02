import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  HeartIcon, 
  BookmarkIcon, 
  MapPinIcon, 
  BedIcon, 
  BathIcon, 
  RulerIcon 
} from '../../components/icons';
import './PropertyDetail.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// SVG Icons
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconSpinner = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
  </svg>
);

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

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
        setLikesCount(data.likes_count || 0);
        setComments(data.comments || []);
        if (user) {
          setIsLiked(data.is_liked || false);
          setIsSaved(data.is_saved || false);
        }
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
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL}${imgUrl}`;
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/property/${id}` } });
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/properties/${id}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.like_count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/property/${id}` } });
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/properties/${id}/save/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleWhatsAppContact = () => {
    if (property?.whatsapp_number) {
      const cleanNumber = property.whatsapp_number.replace(/\D/g, '');
      const message = `Hi, I'm interested in your property: ${property.title}`;
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="property-detail-loading">
        <IconSpinner />
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-error">
        <h2>Property Not Found</h2>
        <p>Sorry, we could not find the property you are looking for.</p>
        <button onClick={() => navigate('/timeline')} className="back-btn">
          Back to Timeline
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

        {/* Main Content */}
        <div className="property-detail-grid">
          {/* LEFT COLUMN */}
          <div className="property-detail-left">
            {/* Image Gallery */}
            <div className="property-gallery">
              <div className="main-image-container">
                <img 
                  src={getImageUrl(property.images?.[selectedImage]) || 'https://placehold.co/800x500/e8e5e1/1a1a1a?text=Property'} 
                  alt={property.title}
                  className="main-image"
                />
                {property.images && property.images.length > 1 && (
                  <div className="image-nav">
                    <button 
                      className="nav-btn prev"
                      onClick={() => setSelectedImage(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                    >
                      <IconChevronLeft />
                    </button>
                    <span className="image-counter">{selectedImage + 1} / {property.images.length}</span>
                    <button 
                      className="nav-btn next"
                      onClick={() => setSelectedImage(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                    >
                      <IconChevronRight />
                    </button>
                  </div>
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

            {/* Title & Price */}
            <div className="property-header">
              <h1 className="property-title">{property.title}</h1>
              <div className="property-price-large">{formatZAR(property.monthly_rent)}<span>/month</span></div>
            </div>

            {/* Location */}
            <div className="property-location">
              <MapPinIcon />
              <span>{property.address}, {property.city}</span>
            </div>

            {/* Specs */}
            <div className="property-specs">
              <div className="spec-item">
                <BedIcon />
                <span>{property.bedrooms || '?'} Bedrooms</span>
              </div>
              <div className="spec-item">
                <BathIcon />
                <span>{property.bathrooms || '?'} Bathrooms</span>
              </div>
              {property.size && (
                <div className="spec-item">
                  <RulerIcon />
                  <span>{property.size} m²</span>
                </div>
              )}
            </div>

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
                      <IconCheck />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="property-detail-right">
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className={`action-btn like-btn ${isLiked ? 'active' : ''}`}
                onClick={handleLike}
              >
                <HeartIcon />
                <span>{likesCount}</span>
              </button>
              <button 
                className={`action-btn save-btn ${isSaved ? 'active' : ''}`}
                onClick={handleSave}
              >
                <BookmarkIcon />
                <span>Save</span>
              </button>
            </div>

            {/* WhatsApp */}
            {property.whatsapp_number && (
              <button className="whatsapp-btn" onClick={handleWhatsAppContact}>
                <IconWhatsApp />
                Contact on WhatsApp
              </button>
            )}

            {/* Book Now */}
            <Link to={`/booking/${property.id}`} className="book-btn">
              <IconCalendar />
              Book Now
            </Link>

            {/* Property Details */}
            <div className="property-meta">
              <h3>Property Details</h3>
              <div className="meta-item">
                <span>Property ID</span>
                <span>#{property.id}</span>
              </div>
              <div className="meta-item">
                <span>Status</span>
                <span className={`status-text ${property.status || 'available'}`}>
                  {property.status || 'Available'}
                </span>
              </div>
              <div className="meta-item">
                <span>Posted</span>
                <span>{new Date(property.created_at).toLocaleDateString()}</span>
              </div>
              {property.property_type && (
                <div className="meta-item">
                  <span>Type</span>
                  <span>{property.property_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}