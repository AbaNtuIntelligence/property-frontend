// src/components/timeline/ImageSlider.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Slower transition speed (600ms instead of 400ms)
  const TRANSITION_DURATION = 600;
  // Slower auto-play interval (8 seconds instead of 5)
  const AUTO_PLAY_INTERVAL = 8000;

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Fix: Properly extract image URL from various formats
  const getImageUrl = (img) => {
    if (!img) return null;
    
    let imagePath = img;
    if (typeof img === 'object') {
      imagePath = img.image || img.url || img.path;
    }
    
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/media')) {
      return `${API_URL}${imagePath}`;
    }
    
    if (imagePath.startsWith('/')) {
      return `${API_URL}${imagePath}`;
    }
    
    return `${API_URL}/media/${imagePath}`;
  };

  const imagesList = Array.isArray(images) 
    ? images.map(img => getImageUrl(img)).filter(url => url !== null)
    : [];

  // Sequential image loading - loads one at a time
  useEffect(() => {
    if (imagesList.length === 0) return;
    
    // Load images sequentially (one at a time, not all at once)
    let currentImageIndex = 0;
    
    const loadNextImage = () => {
      if (currentImageIndex >= imagesList.length) return;
      
      const imgUrl = imagesList[currentImageIndex];
      if (imgUrl && !loadedImages[imgUrl]) {
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [imgUrl]: true }));
          currentImageIndex++;
          // Add a delay between loading images (500ms)
          setTimeout(loadNextImage, 500);
        };
        img.onerror = () => {
          currentImageIndex++;
          setTimeout(loadNextImage, 500);
        };
      } else {
        currentImageIndex++;
        setTimeout(loadNextImage, 500);
      }
    };
    
    loadNextImage();
  }, [imagesList]);

  // Preload only the next image (not all)
  const preloadAdjacentImages = () => {
    // Preload next image only
    const nextIndex = (currentIndex + 1) % imagesList.length;
    if (imagesList[nextIndex] && !loadedImages[imagesList[nextIndex]]) {
      const img = new Image();
      img.src = imagesList[nextIndex];
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [imagesList[nextIndex]]: true }));
      };
    }
  };

  // Preload next image when current changes
  useEffect(() => {
    preloadAdjacentImages();
  }, [currentIndex]);

  // Slower auto-play
  useEffect(() => {
    if (imagesList.length <= 1) return;
    
    if (!isHovering && !isDragging && !isAnimating) {
      autoPlayRef.current = setTimeout(() => {
        nextImage();
      }, AUTO_PLAY_INTERVAL);
    }
    
    return () => clearTimeout(autoPlayRef.current);
  }, [currentIndex, isHovering, isDragging, isAnimating]);

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setSlideDirection(index > currentIndex ? 'next' : 'prev');
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
  };

  const nextImage = () => {
    if (isAnimating || imagesList.length === 0) return;
    goToSlide((currentIndex + 1) % imagesList.length);
  };

  const prevImage = () => {
    if (isAnimating || imagesList.length === 0) return;
    goToSlide((currentIndex - 1 + imagesList.length) % imagesList.length);
  };

  // Mouse drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  // Touch swipe for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextImage();
    }
    if (touchStart - touchEnd < -75) {
      prevImage();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!images || images.length === 0 || imagesList.length === 0) {
    return (
      <div className="image-slider-placeholder">
        <span>🏠</span>
        <p>No images available</p>
      </div>
    );
  }

  const currentImageLoaded = loadedImages[imagesList[currentIndex]];

  return (
    <div 
      className="image-slider"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="slider-container">
        <div 
          className={`slider-track ${slideDirection}`}
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isAnimating ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none'
          }}
        >
          {imagesList.map((imgUrl, idx) => (
            <div key={idx} className="slider-slide">
              {loadedImages[imgUrl] ? (
                <img 
                  src={imgUrl}
                  alt={`${title || 'Property'} - ${idx + 1}`}
                  className="slider-image"
                  draggable={false}
                />
              ) : (
                <div className="slider-image-placeholder">
                  <div className="loader-spinner-small"></div>
                  <span>Loading...</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loading Indicator for Current Image */}
        {!currentImageLoaded && (
          <div className="slider-loader">
            <div className="loader-spinner"></div>
          </div>
        )}

        {/* Navigation Arrows - Show on hover */}
        {imagesList.length > 1 && isHovering && (
          <>
            <button className="slider-arrow prev" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="slider-arrow next" onClick={nextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {imagesList.length > 1 && (
          <div className="slider-counter">
            {currentIndex + 1} / {imagesList.length}
          </div>
        )}

        {/* Thumbnail Strip - Desktop */}
        {imagesList.length > 1 && (
          <div className="thumbnail-strip">
            {imagesList.map((imgUrl, idx) => (
              <div 
                key={idx}
                className={`thumbnail ${idx === currentIndex ? 'active' : ''} ${loadedImages[imgUrl] ? 'loaded' : ''}`}
                onClick={() => goToSlide(idx)}
              >
                {loadedImages[imgUrl] ? (
                  <img 
                    src={imgUrl} 
                    alt={`Thumb ${idx + 1}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="thumb-placeholder"></div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dots - Mobile */}
        {imagesList.length > 1 && (
          <div className="slider-dots">
            {imagesList.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;