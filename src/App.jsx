import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';  // Import your routes from routes.jsx
import { AuthProvider } from './hooks/useAuth';
import { BookingProvider } from './hooks/useBooking';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BookingProvider>
                <Router>  {/* Single Router at top level */}
                    <AppRoutes />  {/* Your routes from routes.jsx */}
                </Router>
            </BookingProvider>
        </AuthProvider>
    );
}

export default App;