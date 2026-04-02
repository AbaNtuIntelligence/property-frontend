import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      guests
    });
    
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Where are you going?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="search-input-group">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="search-input"
          placeholder="Check in"
        />
      </div>
      
      <div className="search-input-group">
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="search-input"
          placeholder="Check out"
        />
      </div>
      
      <div className="search-input-group">
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="search-input"
          placeholder="Guests"
        />
      </div>
      
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}