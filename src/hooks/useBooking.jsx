import { useContext, createContext, useState } from 'react';
import rentalService from '../pages/services/rentalService';

const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const createBooking = async (bookingData) => {
        setLoading(true);
        try {
            const data = await rentalService.createRental({
                property: bookingData.propertyId,
                start_date: bookingData.checkIn,
                end_date: bookingData.checkOut,
                monthly_rent: bookingData.totalPrice,
                deposit_amount: bookingData.totalPrice * 0.2,
                is_active: true
            });
            
            setBookings(prev => [...prev, data]);
            return { success: true, data };
        } catch (error) {
            console.error('Booking error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const getUserBookings = async () => {
        setLoading(true);
        try {
            const data = await rentalService.getUserRentals();
            setBookings(data);
            return data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const value = {
        bookings,
        loading,
        createBooking,
        getUserBookings
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    return useContext(BookingContext);
}