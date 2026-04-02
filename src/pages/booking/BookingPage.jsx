import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBooking } from '../../hooks/useBooking';
import BookingForm from '../../components/booking/BookingForm';
import API from '../../api/axios';
import './BookingPage.css';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await API.get(`/properties/${id}/`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (paymentDetails) => {
    const nights = Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;

    const result = await createBooking({
      property: id,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      guests: 2,
      totalPrice,
      paymentMethod: paymentDetails.paymentMethod
    });

    if (result.success) {
      navigate('/dashboard', { state: { message: 'Booking confirmed successfully!' } });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!property) return <div>Property not found</div>;
  if (!user) {
    navigate('/login', { state: { from: `/booking/${id}` } });
    return null;
  }

  const nights = Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24));
  const totalPrice = property.price * nights;

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-main">
          <h1>Complete Your Booking</h1>
          
          <div className="booking-dates">
            <h2>Your trip</h2>
            <div className="date-inputs">
              <div className="date-input">
                <label>Check in</label>
                <input
                  type="date"
                  value={dates.checkIn}
                  onChange={(e) => setDates({...dates, checkIn: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="date-input">
                <label>Check out</label>
                <input
                  type="date"
                  value={dates.checkOut}
                  onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                  min={dates.checkIn}
                />
              </div>
            </div>
          </div>

          <BookingForm 
            onSubmit={handleBookingSubmit}
            totalAmount={totalPrice}
            onBack={() => navigate(`/property/${id}`)}
          />
        </div>

        <div className="booking-sidebar">
          <div className="booking-summary">
            <h2>Booking Summary</h2>
            <img src={property.images?.[0]} alt={property.title} />
            <h3>{property.title}</h3>
            <p>{property.location}</p>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>${property.price} × {nights} nights</span>
                <span>${property.price * nights}</span>
              </div>
              <div className="price-row">
                <span>Cleaning fee</span>
                <span>${property.cleaningFee || 50}</span>
              </div>
              <div className="price-row">
                <span>Service fee</span>
                <span>${Math.round(totalPrice * 0.12)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>${totalPrice + (property.cleaningFee || 50) + Math.round(totalPrice * 0.12)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}