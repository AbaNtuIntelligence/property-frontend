import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import './FeaturedCarousel.css';

export default function FeaturedCarousel({ properties, title }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Format price in ZAR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Check scroll position and update button states
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      
      // Check if we can scroll left (not at the beginning)
      setCanScrollLeft(scrollLeft > 5);
      
      // Check if we can scroll right (not at the end)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      
      // Calculate current index based on scroll position
      if (properties.length > 0) {
        const itemWidth = 320 + 25; // card width + gap
        const newIndex = Math.round(scrollLeft / itemWidth);
        setCurrentIndex(Math.min(newIndex, properties.length - 1));
      }
    }
  };

  // Initialize and add scroll listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      checkScroll(); // Initial check
      carousel.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        carousel.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [properties]);

  // Scroll function with smooth behavior
  const scroll = (direction) => {
    if (carouselRef.current && properties.length > 0) {
      const cardWidth = 320; // Card width
      const gap = 25; // Gap between cards
      const scrollAmount = cardWidth + gap;
      
      const currentScroll = carouselRef.current.scrollLeft;
      let newScrollLeft;
      
      if (direction === 'left') {
        newScrollLeft = Math.max(0, currentScroll - scrollAmount);
      } else {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        newScrollLeft = Math.min(maxScroll, currentScroll + scrollAmount);
      }
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to specific index when clicking progress dots
  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const cardWidth = 320 + 25; // card width + gap
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handlePropertyClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleWishlistClick = (e, property) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property);
    }
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="no-properties">
        <span className="no-properties-icon">🏠</span>
        <p>No properties available in South Africa</p>
      </div>
    );
  }

  return (
    <div className="featured-carousel">
      {title && (
        <div className="carousel-header">
          <h3 className="carousel-title">{title}</h3>
          <div className="carousel-controls">
            <button 
              className={`carousel-arrow left ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              ←
            </button>
            <button 
              className={`carousel-arrow right ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>
      )}
      
      <div className="carousel-container">
        <div 
          className="carousel-track" 
          ref={carouselRef}
        >
          {properties.map((property, index) => (
            <div 
              key={property.id} 
              className={`property-card ${currentIndex === index ? 'center' : ''}`}
              onClick={() => handlePropertyClick(property.id)}
            >
              <div className="property-image-container">
                <img 
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'} 
                  alt={property.title}
                  loading="lazy"
                />
                {property.isNew && <span className="new-badge">NUUT</span>}
                {property.isTrending && (
                  <span className="trending-badge">
                    <span className="trending-icon">🔥</span>
                    Trending
                  </span>
                )}
                <button 
                  className={`wishlist-button ${isInWishlist(property.id) ? 'active' : ''}`}
                  onClick={(e) => handleWishlistClick(e, property)}
                >
                  {isInWishlist(property.id) ? '❤️' : '🤍'}
                </button>
              </div>
              
              <div className="property-info">
                <div className="property-location">
                  <span className="location-icon">📍</span>
                  <span>{property.city}, {property.province || 'South Africa'}</span>
                </div>
                
                <h4 className="property-title">{property.title}</h4>
                
                <div className="property-details">
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'slaapkamer' : 'slaapkamers'}</span>
                  <span>•</span>
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'badkamer' : 'badkamers'}</span>
                  <span>•</span>
                  <span>{property.maxGuests} {property.maxGuests === 1 ? 'gaste' : 'gas'}</span>
                </div>
                
                <div className="property-footer">
                  <div className="property-price">
                    <span className="price-amount">{formatPrice(property.price)}</span>
                    <span className="price-period">/nag</span>
                  </div>
                  
                  <div className="property-rating">
                    <span className="star-icon">★</span>
                    <span>{property.rating}</span>
                    {property.reviewCount && (
                      <span className="review-count">({property.reviewCount})</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      {properties.length > 1 && (
        <div className="carousel-progress">
          {properties.map((_, index) => (
            <button
              key={index}
              className={`progress-dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}