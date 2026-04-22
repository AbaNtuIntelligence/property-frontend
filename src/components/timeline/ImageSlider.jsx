import React, { useState } from 'react';
import './ImageSlider.css';

export default function ImageSlider({ images, propertyTitle }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const getImageUrl = (img) => {
    const imgUrl = img.image || img.url;
    if (!imgUrl) return null;
    return imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Main Slider */}
      <div className="image-slider" onClick={openModal}>
        <div className="slider-container">
          <img 
            src={getImageUrl(images[currentIndex])} 
            alt={`${propertyTitle} - Image ${currentIndex + 1}`}
            className="slider-image"
          />
          
          {images.length > 1 && (
            <>
              <button className="slider-btn prev" onClick={prevSlide}>
                ❮
              </button>
              <button className="slider-btn next" onClick={nextSlide}>
                ❯
              </button>
              <div className="image-counter">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="image-thumbnails">
            {images.slice(0, 5).map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              >
                <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
            {images.length > 5 && (
              <div className="thumbnail more">+{images.length - 5}</div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img 
              src={getImageUrl(images[currentIndex])} 
              alt={`${propertyTitle} - Fullscreen`}
              className="modal-image"
            />
            {images.length > 1 && (
              <>
                <button className="modal-btn modal-prev" onClick={prevSlide}>❮</button>
                <button className="modal-btn modal-next" onClick={nextSlide}>❯</button>
                <div className="modal-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}