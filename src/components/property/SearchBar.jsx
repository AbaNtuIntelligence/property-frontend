// src/components/search/SearchBar.jsx
import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch, initialLocation = "" }) {
  const [location, setLocation] = useState(initialLocation);
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchParams = {
      location: location.trim(),
      propertyType,
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
    };
    
    // Remove empty params
    Object.keys(searchParams).forEach(key => {
      if (!searchParams[key]) delete searchParams[key];
    });
    
    onSearch(searchParams);
  };

  const handleClearFilters = () => {
    setLocation("");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    onSearch({});
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <div className="search-field">
            <span className="search-icon">📍</span>
            <input
              type="text"
              placeholder="Search by city or suburb..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <button type="submit" className="search-btn">
            🔍 Search
          </button>
          
          <button 
            type="button" 
            className="filter-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "▲ Less filters" : "▼ More filters"}
          </button>
        </div>
        
        {isExpanded && (
          <div className="search-filters">
            <div className="filter-row">
              <div className="filter-field">
                <label>Property Type</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="studio">Studio</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>
              
              <div className="filter-field">
                <label>Bedrooms</label>
                <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                  <option value="">Any</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-field">
                <label>Min Price (R)</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              
              <div className="filter-field">
                <label>Max Price (R)</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-actions">
              <button type="button" className="clear-filters-btn" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}