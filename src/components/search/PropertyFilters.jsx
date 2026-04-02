import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyFilters.css';

export default function PropertyFilters({ hero = false }) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any',
    bathrooms: 'any'
  });

  // Toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Close all dropdowns
  const closeDropdowns = () => {
    setOpenDropdown(null);
  };

  // SA Property Types
  const propertyTypes = [
    { id: 'all', label: 'All Properties', icon: '🏠' },
    { id: 'apartment', label: 'Apartment', icon: '🏢' },
    { id: 'townhouse', label: 'Townhouse', icon: '🏘️' },
    { id: 'house', label: 'House', icon: '🏡' },
    { id: 'farm', label: 'Farm', icon: '🚜' },
    { id: 'cottage', label: 'Cottage', icon: '🏕️' },
    { id: 'duplex', label: 'Duplex', icon: '🏠' },
    { id: 'cluster', label: 'Cluster', icon: '🏘️' },
    { id: 'simplex', label: 'Simplex', icon: '🏠' },
    { id: 'studio', label: 'Studio', icon: '🎨' },
    { id: 'penthouse', label: 'Penthouse', icon: '🏙️' }
  ];

  // Price options in ZAR
  const priceOptions = [
    { value: '', label: 'Any Price' },
    { value: '5000', label: 'R 5,000' },
    { value: '10000', label: 'R 10,000' },
    { value: '15000', label: 'R 15,000' },
    { value: '20000', label: 'R 20,000' },
    { value: '25000', label: 'R 25,000' },
    { value: '30000', label: 'R 30,000' },
    { value: '35000', label: 'R 35,000' },
    { value: '40000', label: 'R 40,000' },
    { value: '45000', label: 'R 45,000' },
    { value: '50000', label: 'R 50,000' },
    { value: '60000', label: 'R 60,000' },
    { value: '70000', label: 'R 70,000' },
    { value: '80000', label: 'R 80,000' },
    { value: '90000', label: 'R 90,000' },
    { value: '100000', label: 'R 100,000' },
    { value: '150000', label: 'R 150,000' },
    { value: '200000', label: 'R 200,000' },
    { value: '250000', label: 'R 250,000' },
    { value: '300000', label: 'R 300,000' },
    { value: '400000', label: 'R 400,000' },
    { value: '500000', label: 'R 500,000' },
    { value: '1000000', label: 'R 1,000,000' }
  ];

  // Bedroom options
  const bedroomOptions = [
    { value: 'any', label: 'Any', icon: '🛏️' },
    { value: '1', label: '1+', icon: '🛏️' },
    { value: '2', label: '2+', icon: '🛏️🛏️' },
    { value: '3', label: '3+', icon: '🛏️🛏️🛏️' },
    { value: '4', label: '4+', icon: '🛏️🛏️🛏️🛏️' },
    { value: '5', label: '5+', icon: '🛏️🛏️🛏️🛏️🛏️' }
  ];

  // Bathroom options
  const bathroomOptions = [
    { value: 'any', label: 'Any', icon: '🚿' },
    { value: '1', label: '1+', icon: '🚿' },
    { value: '2', label: '2+', icon: '🚿🚿' },
    { value: '3', label: '3+', icon: '🚿🚿🚿' },
    { value: '4', label: '4+', icon: '🚿🚿🚿🚿' }
  ];

  const getSelectedPropertyType = () => {
    const selected = propertyTypes.find(t => t.id === filters.propertyType);
    return selected ? selected.label : 'Property Type';
  };

  const getSelectedPriceLabel = (type) => {
    const value = filters[type];
    const option = priceOptions.find(o => o.value === value);
    return option ? option.label : (type === 'minPrice' ? 'Min Price' : 'Max Price');
  };

  const getSelectedBedrooms = () => {
    const selected = bedroomOptions.find(o => o.value === filters.bedrooms);
    return selected ? selected.label : 'Bedrooms';
  };

  const getSelectedBathrooms = () => {
    const selected = bathroomOptions.find(o => o.value === filters.bathrooms);
    return selected ? selected.label : 'Bathrooms';
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType !== 'all') params.set('type', filters.propertyType);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms !== 'any') params.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms !== 'any') params.set('bathrooms', filters.bathrooms);
    
    navigate(`/properties?${params.toString()}`);
    closeDropdowns();
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'any',
      bathrooms: 'any'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.propertyType !== 'all') count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.bathrooms !== 'any') count++;
    return count;
  };

  return (
    <div className={`property-filters ${hero ? 'hero-filters' : ''}`}>
      {/* Location Search Bar - Always visible */}
      {hero && (
        <div className="location-search-container">
          <span className="search-icon">📍</span>
          <input
            type="text"
            className="location-input"
            placeholder="Search by city, suburb, or address..."
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>
      )}

      {/* Dropdown Menu Bar */}
      <div className="dropdown-menu-bar">
        {/* Property Type Dropdown */}
        <div className="dropdown-container">
          <button 
            className={`dropdown-trigger ${openDropdown === 'propertyType' ? 'active' : ''}`}
            onClick={() => toggleDropdown('propertyType')}
          >
            <span className="trigger-icon">🏠</span>
            <span className="trigger-label">{getSelectedPropertyType()}</span>
            <span className="trigger-arrow">{openDropdown === 'propertyType' ? '▲' : '▼'}</span>
          </button>
          
          {openDropdown === 'propertyType' && (
            <div className="dropdown-menu property-type-menu">
              <div className="menu-header">
                <h4>Select Property Type</h4>
                <button className="close-menu" onClick={closeDropdowns}>×</button>
              </div>
              <div className="menu-content">
                {propertyTypes.map(type => (
                  <button
                    key={type.id}
                    className={`menu-item ${filters.propertyType === type.id ? 'active' : ''}`}
                    onClick={() => {
                      setFilters({...filters, propertyType: type.id});
                      closeDropdowns();
                    }}
                  >
                    <span className="item-icon">{type.icon}</span>
                    <span className="item-label">{type.label}</span>
                    {filters.propertyType === type.id && (
                      <span className="item-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Min Price Dropdown */}
        <div className="dropdown-container">
          <button 
            className={`dropdown-trigger ${openDropdown === 'minPrice' ? 'active' : ''}`}
            onClick={() => toggleDropdown('minPrice')}
          >
            <span className="trigger-icon">💰</span>
            <span className="trigger-label">{getSelectedPriceLabel('minPrice')}</span>
            <span className="trigger-arrow">{openDropdown === 'minPrice' ? '▲' : '▼'}</span>
          </button>
          
          {openDropdown === 'minPrice' && (
            <div className="dropdown-menu price-menu">
              <div className="menu-header">
                <h4>Minimum Price (ZAR)</h4>
                <button className="close-menu" onClick={closeDropdowns}>×</button>
              </div>
              <div className="menu-content price-list">
                {priceOptions.map(option => (
                  <button
                    key={`min-${option.value}`}
                    className={`menu-item ${filters.minPrice === option.value ? 'active' : ''}`}
                    onClick={() => {
                      setFilters({...filters, minPrice: option.value});
                      closeDropdowns();
                    }}
                  >
                    <span className="item-label">{option.label}</span>
                    {filters.minPrice === option.value && (
                      <span className="item-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Max Price Dropdown */}
        <div className="dropdown-container">
          <button 
            className={`dropdown-trigger ${openDropdown === 'maxPrice' ? 'active' : ''}`}
            onClick={() => toggleDropdown('maxPrice')}
          >
            <span className="trigger-icon">💰</span>
            <span className="trigger-label">{getSelectedPriceLabel('maxPrice')}</span>
            <span className="trigger-arrow">{openDropdown === 'maxPrice' ? '▲' : '▼'}</span>
          </button>
          
          {openDropdown === 'maxPrice' && (
            <div className="dropdown-menu price-menu">
              <div className="menu-header">
                <h4>Maximum Price (ZAR)</h4>
                <button className="close-menu" onClick={closeDropdowns}>×</button>
              </div>
              <div className="menu-content price-list">
                {priceOptions.map(option => (
                  <button
                    key={`max-${option.value}`}
                    className={`menu-item ${filters.maxPrice === option.value ? 'active' : ''}`}
                    onClick={() => {
                      setFilters({...filters, maxPrice: option.value});
                      closeDropdowns();
                    }}
                  >
                    <span className="item-label">{option.label}</span>
                    {filters.maxPrice === option.value && (
                      <span className="item-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bedrooms Dropdown */}
        <div className="dropdown-container">
          <button 
            className={`dropdown-trigger ${openDropdown === 'bedrooms' ? 'active' : ''}`}
            onClick={() => toggleDropdown('bedrooms')}
          >
            <span className="trigger-icon">🛏️</span>
            <span className="trigger-label">{getSelectedBedrooms()}</span>
            <span className="trigger-arrow">{openDropdown === 'bedrooms' ? '▲' : '▼'}</span>
          </button>
          
          {openDropdown === 'bedrooms' && (
            <div className="dropdown-menu bedrooms-menu">
              <div className="menu-header">
                <h4>Bedrooms</h4>
                <button className="close-menu" onClick={closeDropdowns}>×</button>
              </div>
              <div className="menu-content">
                {bedroomOptions.map(option => (
                  <button
                    key={option.value}
                    className={`menu-item ${filters.bedrooms === option.value ? 'active' : ''}`}
                    onClick={() => {
                      setFilters({...filters, bedrooms: option.value});
                      closeDropdowns();
                    }}
                  >
                    <span className="item-icon">{option.icon}</span>
                    <span className="item-label">{option.label}</span>
                    {filters.bedrooms === option.value && (
                      <span className="item-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bathrooms Dropdown */}
        <div className="dropdown-container">
          <button 
            className={`dropdown-trigger ${openDropdown === 'bathrooms' ? 'active' : ''}`}
            onClick={() => toggleDropdown('bathrooms')}
          >
            <span className="trigger-icon">🚿</span>
            <span className="trigger-label">{getSelectedBathrooms()}</span>
            <span className="trigger-arrow">{openDropdown === 'bathrooms' ? '▲' : '▼'}</span>
          </button>
          
          {openDropdown === 'bathrooms' && (
            <div className="dropdown-menu bathrooms-menu">
              <div className="menu-header">
                <h4>Bathrooms</h4>
                <button className="close-menu" onClick={closeDropdowns}>×</button>
              </div>
              <div className="menu-content">
                {bathroomOptions.map(option => (
                  <button
                    key={option.value}
                    className={`menu-item ${filters.bathrooms === option.value ? 'active' : ''}`}
                    onClick={() => {
                      setFilters({...filters, bathrooms: option.value});
                      closeDropdowns();
                    }}
                  >
                    <span className="item-icon">{option.icon}</span>
                    <span className="item-label">{option.label}</span>
                    {filters.bathrooms === option.value && (
                      <span className="item-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="filter-actions-bar">
        <button className="search-btn" onClick={handleSearch}>
          <span className="btn-icon">🔍</span>
          Search
          {getActiveFilterCount() > 0 && (
            <span className="filter-badge">{getActiveFilterCount()}</span>
          )}
        </button>
        
        {getActiveFilterCount() > 0 && (
          <button className="clear-btn" onClick={clearFilters}>
            <span className="btn-icon">🔄</span>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}