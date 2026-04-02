import React, { useState, useEffect } from 'react';
import './OptimizedImage.css';

export default function OptimizedImage({ src, alt, className, width, height }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src]);

  if (isLoading) {
    return <div className="image-placeholder" style={{ width, height }}>Loading...</div>;
  }

  if (error) {
    return <div className="image-error" style={{ width, height }}>⚠️</div>;
  }

  return <img src={imageSrc} alt={alt} className={className} loading="lazy" />;
}