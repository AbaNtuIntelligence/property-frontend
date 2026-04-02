import React from 'react';
import './LocationMap.css';

export default function LocationMap({ lat, lng, address }) {
  return (
    <div className="location-map">
      <div className="map-container placeholder-map">
        <div className="map-placeholder">
          <span className="map-icon">🗺️</span>
          <h3>Location Map</h3>
          <p className="coordinates-display">
            {lat}, {lng}
          </p>
        </div>
      </div>
      
      <div className="location-details">
        <h3>Location</h3>
        <p className="address">{address}</p>
        
        <div className="map-actions">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            📍 Open in Google Maps
          </a>
          <a 
            href={`https://maps.apple.com/?ll=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link apple"
          >
            🗺️ Open in Apple Maps
          </a>
        </div>
      </div>
    </div>
  );
}