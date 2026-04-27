// src/components/property/RoomDimensions.jsx
import React, { useState } from 'react';
import './RoomDimensions.css';

const RoomDimensions = ({ dimensions, totalArea }) => {
  const [expanded, setExpanded] = useState(false);
  
  const roomConfig = {
    livingRoom: { icon: '🛋️', label: 'Living Room' },
    masterBedroom: { icon: '👑', label: 'Master Bedroom' },
    bedroom2: { icon: '🛏️', label: 'Bedroom 2' },
    bedroom3: { icon: '🛏️', label: 'Bedroom 3' },
    kitchen: { icon: '🍳', label: 'Kitchen' },
    diningRoom: { icon: '🍽️', label: 'Dining Room' },
    study: { icon: '📚', label: 'Study/Office' },
  };
  
  const validRooms = Object.entries(dimensions || {})
    .filter(([key, dim]) => dim?.length && dim?.width && roomConfig[key]);
  
  if (validRooms.length === 0 && !totalArea) return null;
  
  const calculateArea = (length, width) => {
    return (parseFloat(length) * parseFloat(width)).toFixed(1);
  };
  
  return (
    <div className="room-dimensions-wrapper">
      <button 
        className="dimensions-trigger"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="trigger-icon">📐</span>
        <span className="trigger-text">Room Dimensions</span>
        {totalArea && <span className="trigger-badge">{totalArea} m² total</span>}
        <span className="trigger-arrow">{expanded ? '▲' : '▼'}</span>
      </button>
      
      {expanded && (
        <div className="dimensions-panel">
          {validRooms.map(([key, dim]) => {
            const config = roomConfig[key];
            const area = calculateArea(dim.length, dim.width);
            return (
              <div key={key} className="dimension-item">
                <span className="dimension-icon">{config.icon}</span>
                <div className="dimension-info">
                  <div className="dimension-name">{config.label}</div>
                  <div className="dimension-size">
                    {dim.length} × {dim.width} m
                  </div>
                </div>
                <div className="dimension-area">{area} m²</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomDimensions;