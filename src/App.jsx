import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './hooks/useAuth';
import { BookingProvider } from './hooks/useBooking';
import Footer from './components/layout/Footer';  // Import Footer
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BookingProvider>
                <Router>
                    <div className="app-wrapper">
                        <div className="content-wrapper">
                            <AppRoutes />
                        </div>
                        <Footer />
                    </div>
                </Router>
            </BookingProvider>
        </AuthProvider>
    );
}

export default App;