import React, { useState, useEffect } from 'react';
import { propertyService, authService } from '../../pages/services';
import './AmenitiesList.css';

// Amenity icons mapping
const amenityIcons = {
  'wifi': '📶',
  'pool': '🏊',
  'kitchen': '🍳',
  'parking': '🅿️',
  'ac': '❄️',
  'heating': '🔥',
  'tv': '📺',
  'washer': '🧺',
  'dryer': '🌀',
  'gym': '💪',
  'hot tub': '🛁',
  'beach access': '🏖️',
  'pet friendly': '🐾',
  'smoke alarm': '🚨',
  'fire extinguisher': '🧯',
  'first aid': '🏥',
  'workspace': '💻',
  'elevator': '🛗',
  'fireplace': '🔥',
  'balcony': '🏞️',
  'garden': '🌳',
  'bbq': '🍖',
  'breakfast': '🍳',
  '24/7 check-in': '⏰',
  'luggage storage': '🧳'
};

export default function AmenitiesList({ propertyId, amenities: initialAmenities, limit = 8 }) {
  const [amenities, setAmenities] = useState(initialAmenities || []);
  const [loading, setLoading] = useState(!initialAmenities);
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    if (!initialAmenities && propertyId) {
      fetchAmenities();
    } else if (initialAmenities) {
      categorizeAmenities(initialAmenities);
    }
  }, [propertyId, initialAmenities]);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getPropertyAmenities(propertyId);
      setAmenities(data);
      categorizeAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorizeAmenities = (amenitiesList) => {
    const grouped = amenitiesList.reduce((acc, amenity) => {
      const category = amenity.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    }, {});
    setCategories(grouped);
  };

  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    for (const [key, icon] of Object.entries(amenityIcons)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    return '✓';
  };

  const displayedAmenities = showAll ? amenities : amenities.slice(0, limit);

  if (loading) {
    return (
      <div className="amenities-loading">
        <div className="loading-spinner"></div>
        <p>Loading amenities...</p>
      </div>
    );
  }

  if (!amenities || amenities.length === 0) {
    return (
      <div className="amenities-empty">
        <span className="empty-icon">🔧</span>
        <p>No amenities information available</p>
      </div>
    );
  }

  return (
    <div className="amenities-list-container">
      <h3 className="amenities-title">
        What this place offers
        <span className="amenities-count">{amenities.length} amenities</span>
      </h3>

      {!showAll ? (
        // Grid view for limited amenities
        <div className="amenities-grid">
          {displayedAmenities.map((amenity, index) => (
            <div key={amenity.id || index} className="amenity-item">
              <span className="amenity-icon">
                {getAmenityIcon(amenity.name)}
              </span>
              <div className="amenity-details">
                <span className="amenity-name">{amenity.name}</span>
                {amenity.description && (
                  <span className="amenity-description">{amenity.description}</span>
                )}
              </div>
              {amenity.extra && (
                <span className="amenity-extra">{amenity.extra}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Categorized view for all amenities
        <div className="amenities-categorized">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="amenity-category">
              <h4 className="category-name">{category}</h4>
              <div className="category-items">
                {items.map((amenity, index) => (
                  <div key={amenity.id || index} className="category-item">
                    <span className="item-icon">
                      {getAmenityIcon(amenity.name)}
                    </span>
                    <span className="item-name">{amenity.name}</span>
                    {amenity.isFree === false && (
                      <span className="item-fee">• Additional fee</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {amenities.length > limit && (
        <button 
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <span>Show less</span>
              <span className="btn-icon">↑</span>
            </>
          ) : (
            <>
              <span>Show all {amenities.length} amenities</span>
              <span className="btn-icon">↓</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}