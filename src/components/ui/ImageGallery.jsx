import React, { useState } from 'react';
import './ImageGallery.css';

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="no-images">
        <div className="no-images-content">
          <span className="no-images-icon">📷</span>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleViewAll = () => {
    setModalImage(selectedImage);
    setShowModal(true);
  };

  const handlePrevImage = () => {
    setModalImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setModalImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowModal(false);
    } else if (e.key === 'ArrowLeft') {
      handlePrevImage();
    } else if (e.key === 'ArrowRight') {
      handleNextImage();
    }
  };

  return (
    <>
      <div className="image-gallery">
        <div className="main-image-container">
          <img 
            src={images[selectedImage]} 
            alt="Property main view" 
            className="main-image"
            onClick={handleViewAll}
          />
          <button className="view-all-btn" onClick={handleViewAll}>
            <span>📷</span> View all photos
          </button>
        </div>
        
        <div className="thumbnail-grid">
          {images.slice(0, 4).map((image, index) => (
            <div 
              key={index} 
              className={`thumbnail-wrapper ${selectedImage === index ? 'active' : ''}`}
              onClick={() => handleImageClick(index)}
            >
              <img src={image} alt={`Property view ${index + 1}`} />
              {index === 3 && images.length > 4 && (
                <div className="more-images-overlay" onClick={handleViewAll}>
                  <span>+{images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="gallery-modal" onClick={() => setShowModal(false)} onKeyDown={handleKeyDown} tabIndex={0}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ×
            </button>
            
            <button className="modal-nav prev" onClick={handlePrevImage}>
              ‹
            </button>
            
            <div className="modal-image-container">
              <img src={images[modalImage]} alt={`Property view ${modalImage + 1}`} />
            </div>
            
            <button className="modal-nav next" onClick={handleNextImage}>
              ›
            </button>

            <div className="modal-thumbnails">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`modal-thumbnail ${modalImage === index ? 'active' : ''}`}
                  onClick={() => setModalImage(index)}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="image-counter">
              {modalImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}