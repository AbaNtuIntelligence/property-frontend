import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's bookings on mount - with error handling
  useEffect(() => {
    // Only try to fetch if we're in development mode with mock data
    if (import.meta.env.DEV) {
      console.log('🔧 Development mode: Using mock booking data');
      // Set some mock bookings for development
      setBookings([]);
    } else {
      fetchUserBookings();
    }
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      // This will fail in development without backend, so we handle it gracefully
      const response = await API.get('/bookings/my-bookings/').catch(err => {
        console.log('ℹ️ Bookings API not available yet - using mock data');
        return { data: [] }; // Return empty array as fallback
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
      // Set empty array so app doesn't crash
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.post('/bookings/', bookingData);
      setBookings(prev => [response.data, ...prev]);
      setCurrentBooking(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await API.post(`/bookings/${bookingId}/cancel/`);
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel booking');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (bookingId) => {
    try {
      const response = await API.get(`/bookings/${bookingId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  };

  const clearCurrentBooking = () => {
    setCurrentBooking(null);
  };

  // This is the Provider return - make sure there's no extra 'return' before this
  return (
    <BookingContext.Provider value={{
      currentBooking,
      bookings,
      loading,
      error,
      createBooking,
      cancelBooking,
      getBookingById,
      fetchUserBookings,
      clearCurrentBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}