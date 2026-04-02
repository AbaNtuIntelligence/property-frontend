import React, { useState } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel({ images, propertyId }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(slideIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="carousel-container">
        <img 
          src="https://via.placeholder.com/680x400?text=No+Image+Available" 
          alt="No image available"
          className="carousel-image"
        />
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-slide">
        <img 
          src={images[currentIndex]} 
          alt={`Property view ${currentIndex + 1}`}
          className="carousel-image"
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="carousel-nav prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              ❮
            </button>
            <button 
              className="carousel-nav next"
              onClick={goToNext}
              aria-label="Next image"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={(e) => goToSlide(index, e)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Replace the existing image counter with this smaller version */}
<div className="image-counter-mini">
  {currentIndex + 1}/{images.length}
</div>
    </div>
  );
}