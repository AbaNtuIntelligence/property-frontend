import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user:', error);
            }
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return <div className="dashboard-loading">Loading dashboard...</div>;
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user.username}!</h1>
                <p className="user-type">{user.user_type === 'owner' ? '🏠 Property Owner' : '🔍 Property Seeker'}</p>
                
                <div className="dashboard-nav" style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        🏠 Browse Properties (Timeline)
                    </button>
                    
                    {user.user_type === 'owner' && (
                        <button 
                            onClick={() => navigate('/property/new')}
                            style={{
                                padding: '10px 20px',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            + List New Property
                        </button>
                    )}
                    
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '10px 20px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-tabs" style={{ display: 'flex', gap: '10px', marginTop: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === 'overview' ? '#007bff' : 'transparent',
                            color: activeTab === 'overview' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('profile')}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === 'profile' ? '#007bff' : 'transparent',
                            color: activeTab === 'profile' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Profile
                    </button>
                </div>

                <div className="dashboard-stats" style={{ marginTop: '30px' }}>
                    {activeTab === 'overview' && (
                        <div>
                            <h2>Dashboard Overview</h2>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                gap: '20px',
                                marginTop: '20px'
                            }}>
                                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                                    <h3>Account Type</h3>
                                    <p>{user.user_type === 'owner' ? 'Property Owner' : 'Property Seeker'}</p>
                                </div>
                                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                                    <h3>Email</h3>
                                    <p>{user.email || 'Not provided'}</p>
                                </div>
                                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                                    <h3>Member Since</h3>
                                    <p>{new Date(user.date_joined || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div>
                            <h2>Profile Information</h2>
                            <div style={{ marginTop: '20px' }}>
                                <p><strong>Username:</strong> {user.username}</p>
                                <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
                                <p><strong>User Type:</strong> {user.user_type === 'owner' ? 'Property Owner' : 'Property Seeker'}</p>
                                <p><strong>Phone:</strong> {user.phone_number || 'Not provided'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}