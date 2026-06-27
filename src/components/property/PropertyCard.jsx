import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  BedIcon,
  BathIcon,
  HeartIcon,
  ChevronRightIcon,
  StarIcon,
  RulerIcon
} from '../icons';
import './PropertyCard.css';

export default function PropertyCard({ property, featured = false, compact = false }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    return `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${imgUrl}`;
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const mainImage = property.images?.[0];
  const hasMultipleImages = property.images?.length > 1;
  const imageSrc = imageError 
    ? 'https://placehold.co/400x300/e8e5e1/1a1a1a?text=Property'
    : getImageUrl(mainImage) || 'https://placehold.co/400x300/e8e5e1/1a1a1a?text=Property';

  return (
    <div className={`property-card ${compact ? 'compact' : ''}`} onClick={handleCardClick}>
      <div className="card-image">
        <img 
          src={imageSrc}
          alt={property.title || 'Property'}
          loading="lazy"
          onError={() => setImageError(true)}
        />
        
        {featured && (
          <span className="card-badge featured-badge">
            <StarIcon />
            Featured
          </span>
        )}
        
        {property.hasInverter && (
          <span className="card-badge inverter-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Backup Power
          </span>
        )}

        {property.hasJojo && (
          <span className="card-badge water-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M12 2l7 7M12 2L5 7" />
            </svg>
            JoJo Tank
          </span>
        )}

        {hasMultipleImages && (
          <span className="image-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            {property.images.length}
          </span>
        )}

        <button className="card-like" onClick={handleLike}>
          <HeartIcon />
          <span className={`like-indicator ${isLiked ? 'active' : ''}`}></span>
        </button>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{property.title || 'Untitled Property'}</h3>
          {property.rating && (
            <span className="card-rating">
              <StarIcon />
              {property.rating}
            </span>
          )}
        </div>

        <p className="card-location">
          <MapPinIcon />
          {property.city || 'South Africa'}
        </p>

        <div className="card-details">
          <span>
            <BedIcon />
            {property.bedrooms || '?'} beds
          </span>
          <span>
            <BathIcon />
            {property.bathrooms || '?'} baths
          </span>
          {property.size && (
            <span>
              <RulerIcon />
              {property.size} m²
            </span>
          )}
        </div>

        <div className="card-footer">
          <p className="card-price">
            {formatZAR(property.monthly_rent || property.price)}
            <span>/month</span>
          </p>
          <button className="card-cta">
            View Details <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}