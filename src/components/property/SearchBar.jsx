import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, MapPinIcon } from '../icons';
import './SearchBar.css';

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search properties...',
  initialQuery = '',
  compact = false 
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (query) searchParams.append('q', query);
    if (location) searchParams.append('location', location);
    if (propertyType) searchParams.append('type', propertyType);
    if (priceRange) searchParams.append('price', priceRange);

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate(`/properties?${searchParams.toString()}`);
    }
  };

  return (
    <form className={`search-bar ${compact ? 'compact' : ''} ${isExpanded ? 'expanded' : ''}`} onSubmit={handleSubmit}>
      <div className="search-bar-main">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {!compact && (
          <button 
            type="button" 
            className="search-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        )}

        <button type="submit" className="search-submit">
          <SearchIcon />
          {!compact && <span>Search</span>}
        </button>
      </div>

      {!compact && isExpanded && (
        <div className="search-bar-filters">
          <div className="filter-group">
            <MapPinIcon />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="filter-input"
            />
          </div>

          <select 
            className="filter-select"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="cabin">Cabin</option>
            <option value="townhouse">Townhouse</option>
          </select>

          <select 
            className="filter-select"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="0-5000">R0 – R5,000</option>
            <option value="5000-10000">R5,000 – R10,000</option>
            <option value="10000-15000">R10,000 – R15,000</option>
            <option value="15000-20000">R15,000 – R20,000</option>
            <option value="20000-30000">R20,000 – R30,000</option>
            <option value="30000-50000">R30,000 – R50,000</option>
            <option value="50000+">R50,000+</option>
          </select>
        </div>
      )}
    </form>
  );
}