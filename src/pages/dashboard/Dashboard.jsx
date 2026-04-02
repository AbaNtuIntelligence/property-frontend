import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../services/propertyService';  // Direct import
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            if (user.user_type === 'OWNER') {
                // Fetch owner's properties
                const props = await propertyService.getPropertiesByOwner(user.id);
                setProperties(props);
            } else if (user.user_type === 'SEEKER') {
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

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.first_name}!</h1>
                <p className="user-type">{user?.user_type === 'OWNER' ? 'Property Owner' : 'Property Seeker'}</p>
            </div>

            <div className="dashboard-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                {user?.user_type === 'OWNER' && (
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
                {user?.user_type === 'SEEKER' && (
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
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            {user?.user_type === 'OWNER' ? (
                                <>
                                    <div className="stat-card">
                                        <span className="stat-icon">🏠</span>
                                        <div className="stat-info">
                                            <h3>{properties.length}</h3>
                                            <p>Total Properties</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">📅</span>
                                        <div className="stat-info">
                                            <h3>3</h3>
                                            <p>Active Rentals</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">💰</span>
                                        <div className="stat-info">
                                            <h3>$4,500</h3>
                                            <p>Monthly Revenue</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">⭐</span>
                                        <div className="stat-info">
                                            <h3>4.8</h3>
                                            <p>Average Rating</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="stat-card">
                                        <span className="stat-icon">📅</span>
                                        <div className="stat-info">
                                            <h3>2</h3>
                                            <p>Active Bookings</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">❤️</span>
                                        <div className="stat-info">
                                            <h3>5</h3>
                                            <p>Saved Properties</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">✍️</span>
                                        <div className="stat-info">
                                            <h3>3</h3>
                                            <p>Reviews Written</p>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-icon">⭐</span>
                                        <div className="stat-info">
                                            <h3>12</h3>
                                            <p>Total Nights</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="recent-activity">
                            <h2>Recent Activity</h2>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <span className="activity-icon">🏠</span>
                                    <div className="activity-details">
                                        <p><strong>New booking</strong> for Beach House</p>
                                        <span className="activity-time">2 hours ago</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-icon">⭐</span>
                                    <div className="activity-details">
                                        <p><strong>New review</strong> from Michael</p>
                                        <span className="activity-time">Yesterday</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-icon">💰</span>
                                    <div className="activity-details">
                                        <p><strong>Payment received</strong> $1,200</p>
                                        <span className="activity-time">2 days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="actions-grid">
                                {user?.user_type === 'OWNER' ? (
                                    <>
                                        <button 
                                            className="action-card"
                                            onClick={() => navigate('/property/new')}
                                        >
                                            <span className="action-icon">➕</span>
                                            <p>Add New Property</p>
                                        </button>
                                        <button className="action-card">
                                            <span className="action-icon">📅</span>
                                            <p>Manage Bookings</p>
                                        </button>
                                        <button className="action-card">
                                            <span className="action-icon">💰</span>
                                            <p>View Earnings</p>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            className="action-card"
                                            onClick={() => navigate('/property')}
                                        >
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

                {activeTab === 'properties' && user?.user_type === 'OWNER' && (
                    <div className="properties-tab">
                        <div className="tab-header">
                            <h2>My Properties</h2>
                            <button 
                                className="add-property-btn"
                                onClick={() => navigate('/property/new')}
                            >
                                + Add Property
                            </button>
                        </div>
                        <div className="properties-list">
                            {properties.length > 0 ? (
                                properties.map(property => (
                                    <div key={property.id} className="property-item">
                                        <img src={property.images?.[0]?.image || '/placeholder.jpg'} alt={property.title} />
                                        <div className="property-info">
                                            <h3>{property.title}</h3>
                                            <p>{property.city}, {property.state}</p>
                                            <p className="price">${property.monthly_rent}/month</p>
                                            <span className={`status ${property.status.toLowerCase()}`}>
                                                {property.status}
                                            </span>
                                        </div>
                                        <div className="property-actions">
                                            <button onClick={() => navigate(`/property/edit/${property.id}`)}>
                                                Edit
                                            </button>
                                            <button className="view-btn" onClick={() => navigate(`/property/${property.id}`)}>
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">No properties yet. Add your first property!</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Add other tab content as needed */}
            </div>
        </div>
    );
}