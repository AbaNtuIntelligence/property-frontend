import React, { useState } from 'react';
import './ImageSlider.css';

export default function ImageSlider({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  if (!images || images.length === 0) {
    return null;
  }

  const getImageUrl = (img) => {
    if (!img) return null;
    // Handle different image formats
    let imgUrl = img.image_url || img.image || img.url || img;
    if (!imgUrl) return null;
    
    // If it's already an absolute URL, return as is
    if (imgUrl.startsWith('http')) {
        return imgUrl;
    }
    // Otherwise, prepend the API URL
    return `${API_URL}${imgUrl}`;
  };

  if (images.length === 1) {
    return (
      <div className="single-image">
        <img 
          src={getImageUrl(images[0])} 
          alt={title}
          className="single-slider-image"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400/1877f2/white?text=🏠+Property';
          }}
        />
      </div>
    );
  }

  return (
    <div className="image-slider">
      <div className="slider-container">
        <img 
          src={getImageUrl(images[currentIndex])} 
          alt={`${title} - ${currentIndex + 1}`}
          className="slider-image"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400/1877f2/white?text=🏠+Property';
          }}
        />
        <button className="slider-btn prev" onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }}>❮</button>
        <button className="slider-btn next" onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }}>❯</button>
        <div className="image-counter">{currentIndex + 1} / {images.length}</div>
      </div>
    </div>
  );
}