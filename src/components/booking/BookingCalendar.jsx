import React, { useState } from 'react';
import './BookingCalendar.css';

export default function BookingCalendar({ 
  checkIn, 
  checkOut, 
  onCheckInChange, 
  onCheckOutChange, 
  bookedDates = [] 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Simple version for now - just date inputs
  return (
    <div className="booking-calendar">
      <div className="calendar-inputs">
        <div className="calendar-input-group">
          <label>Check-in</label>
          <input
            type="date"
            value={checkIn || ''}
            onChange={(e) => onCheckInChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="calendar-input-group">
          <label>Check-out</label>
          <input
            type="date"
            value={checkOut || ''}
            onChange={(e) => onCheckOutChange(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );
}