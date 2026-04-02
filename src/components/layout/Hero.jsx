import React from 'react';
import PropertyFilters from '../search/PropertyFilters';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Find Your Perfect Stay</h1>
        <p className="hero-subtitle">Discover amazing properties at the best prices</p>
        
        {/* Add PropertyFilters here */}
        
        <div className="hero-filters-wrapper">
          <PropertyFilters />
        </div>
      </div>
    </section>
  );
}