import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import "./Dashboard.css";


<button onClick={() => navigate('/property/new')} className="add-property-btn">
  + Add New Property
</button>

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Get user from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user:', error);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            if (user?.user_type === 'owner') {
                // Fetch owner's properties
                const props = await propertyService.getPropertiesByOwner(user.id);
                setProperties(props);
            } else if (user?.user_type === 'seeker') {
                // Fetch seeker's bookings/rentals
                // You'll need to implement this in your service
                // const bookings = await bookingService.getUserBookings();
                // setBookings(bookings);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="dashboard-error">
                <p>Please log in to view your dashboard.</p>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.username || user?.first_name || 'User'}!</h1>
                <p className="user-type">{user?.user_type === 'owner' ? 'Property Owner' : 'Property Seeker'}</p>
                <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                    Logout
                </button>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                {user?.user_type === 'owner' && (
                    <>
                        <button
                            className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
                            onClick={() => setActiveTab('properties')}
                        >
                            My Properties
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'rentals' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rentals')}
                        >
                            Active Rentals
                        </button>
                    </>
                )}
                {user?.user_type === 'seeker' && (
                    <>
                        <button
                            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            My Bookings
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            Saved Properties
                        </button>
                    </>
                )}
                <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <div className="stats-grid">
                            {user?.user_type === 'owner' ? (
                                <>
                                    <div className="stat-card">
                                        <span className="stat-icon">🏠</span>
                                        <div className="stat-info">
                                            <h3>{properties.length}</h3>
                                            <p>Total Properties</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">📊</span>
                                        <div className="stat-info">
                                            <h3>0</h3>
                                            <p>Active Rentals</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">💰</span>
                                        <div className="stat-info">
                                            <h3>$0</h3>
                                            <p>Monthly Revenue</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">⭐</span>
                                        <div className="stat-info">
                                            <h3>0</h3>
                                            <p>Average Rating</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="stat-card">
                                        <span className="stat-icon">📅</span>
                                        <div className="stat-info">
                                            <h3>0</h3>
                                            <p>Active Bookings</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">❤️</span>
                                        <div className="stat-info">
                                            <h3>0</h3>
                                            <p>Saved Properties</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">✍️</span>
                                        <div className="stat-info">
                                            <h3>0</h3>
                                            <p>Reviews Written</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">🌙</span>
                                        <div className="stat-info">
                                            <h3>0</h3>
                                            <p>Total Nights</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="actions-grid">
                                {user?.user_type === 'owner' ? (
                                    <>
                                        <button className="action-card" onClick={() => navigate('/property/new')}>
                                            <span className="action-icon">➕</span>
                                            <p>Add New Property</p>
                                        </button>
                                        <button className="action-card">
                                            <span className="action-icon">📋</span>
                                            <p>Manage Bookings</p>
                                        </button>
                                        <button className="action-card">
                                            <span className="action-icon">💰</span>
                                            <p>View Earnings</p>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="action-card" onClick={() => navigate('/properties')}>
                                            <span className="action-icon">🔍</span>
                                            <p>Browse Properties</p>
                                        </button>
                                        <button className="action-card">
                                            <span className="action-icon">❤️</span>
                                            <p>Saved Properties</p>
                                        </button>
                                        <button className="action-card">
                                            <span className="action-icon">📅</span>
                                            <p>My Trips</p>
                                        </button>
                                    </>
                                )}
                                <button className="action-card">
                                    <span className="action-icon">👤</span>
                                    <p>Edit Profile</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'properties' && user?.user_type === 'owner' && (
                    <div className="properties-tab">
                        <div className="tab-header">
                            <h2>My Properties</h2>
                            <button className="add-property-btn" onClick={() => navigate('/property/new')}>
                                + Add Property
                            </button>
                        </div>
                        <div className="properties-list">
                            {properties.length > 0 ? (
                                properties.map(property => (
                                    <div key={property.id} className="property-item">
                                        <div className="property-info">
                                            <h3>{property.title}</h3>
                                            <p>{property.location}</p>
                                            <p className="price">${property.price}/month</p>
                                        </div>
                                        <div className="property-actions">
                                            <button onClick={() => navigate(`/property/edit/${property.id}`)}>Edit</button>
                                            <button onClick={() => navigate(`/property/${property.id}`)}>View</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">No properties yet. Add your first property!</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}