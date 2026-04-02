import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBooking } from '../../hooks/useBooking';
import propertyService from '../../pages/services/propertyService';
import ImageGallery from '../../components/ui/ImageGallery';
import AmenitiesList from '../../components/property/AmenitiesList';
import HostInfo from '../../components/property/HostInfo';
import SimilarProperties from '../../components/property/SimilarProperties';
import BookingCalendar from '../../components/booking/BookingCalendar';
import ReviewSection from '../../components/reviews/ReviewSection';
import './PropertyDetail.css';
import authService from '../../pages/services/authService';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBooking();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to load property details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/property/${id}` } });
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setBookingLoading(true);
    try {
      const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      const totalPrice = property.price * nights;

      const result = await createBooking({
        propertyId: id,
        checkIn,
        checkOut,
        guests,
        totalPrice
      });

      if (result.success) {
        navigate('/dashboard', { 
          state: { 
            message: 'Booking confirmed successfully!',
            bookingId: result.data.id 
          }
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-error">
        <span className="error-icon">😕</span>
        <h2>Oops! Something went wrong</h2>
        <p>{error || 'Property not found'}</p>
        <button 
          className="back-home-btn"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  const subtotal = property.price * nights;
  const serviceFee = subtotal * 0.12;
  const cleaningFee = property.cleaningFee || 50;
  const total = subtotal + serviceFee + cleaningFee;

  return (
    <div className="property-detail">
      <div className="container">
        {/* Property Header */}
        <div className="property-header">
          <div className="header-left">
            <h1 className="property-title">{property.title}</h1>
            <div className="property-meta">
              <span className="rating">
                ★ {property.rating} ({property.reviewCount} reviews)
              </span>
              <span className="location">
                📍 {property.city}, {property.country}
              </span>
              <span className="guests">
                👥 {property.maxGuests} guests max
              </span>
            </div>
          </div>
          
          <div className="header-right">
            <button className="share-btn">
              <span>↗</span> Share
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={property.images} />

        {/* Main Content */}
        <div className="property-content">
          <div className="main-content">
            {/* Host Info */}
            <section className="content-section">
              <HostInfo 
                host={property.host} 
                propertyId={id}
              />
            </section>

            {/* Description */}
            <section className="content-section">
              <h2>About this space</h2>
              <p className="property-description">{property.description}</p>
            </section>

            {/* Sleeping Arrangements */}
            {property.bedrooms && property.bedrooms.length > 0 && (
              <section className="content-section">
                <h2>Sleeping arrangements</h2>
                <div className="bedrooms-grid">
                  {property.bedrooms.map((bedroom, index) => (
                    <div key={index} className="bedroom-card">
                      <span className="bedroom-icon">🛏️</span>
                      <h3>Bedroom {index + 1}</h3>
                      <p>{bedroom.bedType}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Amenities */}
            <section className="content-section">
              <AmenitiesList 
                propertyId={id}
                amenities={property.amenities}
              />
            </section>

            {/* Reviews */}
            <section className="content-section">
              <ReviewSection 
                propertyId={id} 
                reviews={property.reviews}
                rating={property.rating}
                reviewCount={property.reviewCount}
              />
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="price-display">
                <span className="price">${property.price}</span>
                <span className="period">/ night</span>
              </div>

              <BookingCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                onCheckInChange={setCheckIn}
                onCheckOutChange={setCheckOut}
                bookedDates={property.bookedDates}
              />

              <div className="guest-selector">
                <label htmlFor="guests">Guests</label>
                <select 
                  id="guests"
                  value={guests} 
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {[...Array(property.maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i !== 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {nights > 0 && (
                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>${property.price} × {nights} nights</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Cleaning fee</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="breakdown-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button 
                className="book-now-btn"
                onClick={handleBooking}
                disabled={!checkIn || !checkOut || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Processing...
                  </>
                ) : (
                  'Reserve'
                )}
              </button>

              <p className="booking-note">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <SimilarProperties 
          currentId={id}
          location={property.city}
          type={property.type}
        />
      </div>
    </div>
  );
}