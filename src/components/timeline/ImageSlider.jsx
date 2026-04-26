// src/components/timeline/ImageSlider.jsx
import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Process images when component mounts or images change
  useEffect(() => {
    if (images && images.length > 0) {
      const processedUrls = images.map(img => {
        const imagePath = img.image || img;
        if (!imagePath) return null;
        
        // If it's already a full URL
        if (imagePath.startsWith('http')) {
          return imagePath;
        }
        
        // If it's a relative path
        if (imagePath.startsWith('/')) {
          return `${API_URL}${imagePath}`;
        }
        
        // Otherwise, assume it's from media folder
        return `${API_URL}/media/${imagePath}`;
      }).filter(url => url !== null);
      
      setImageUrls(processedUrls);
    }
  }, [images, API_URL]);

  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next image
      goToNext();
    }
    
    if (touchStart - touchEnd < -75) {
      // Swipe right - previous image
      goToPrevious();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!images || images.length === 0 || imageUrls.length === 0) {
    return (
      <div className="image-slider-container">
        <div className="no-image-placeholder">
          <span>🖼️</span>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-slider-container">
      <div 
        className="slider-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className="slide">
              <img 
                src={imageUrl}
                alt={`${title || 'Property'} - Image ${index + 1}`}
                className="slide-image"
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  console.error(`Failed to load image: ${imageUrl}`);
                  e.target.src = 'https://placehold.co/600x400/1a472a/white?text=🏠+Image+Not+Found';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {imageUrls.length > 1 && (
        <>
          <button 
            className="slider-nav prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ❮
          </button>
          <button 
            className="slider-nav next"
            onClick={goToNext}
            aria-label="Next image"
          >
            ❯
          </button>
        </>
      )}
      
      {/* Image Counter */}
      <div className="slider-counter">
        {currentIndex + 1} / {imageUrls.length}
      </div>
      
      {/* Dots Indicator */}
      {imageUrls.length > 1 && (
        <div className="slider-dots">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="image-loading-overlay">
          <div className="loading-spinner-small"></div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;