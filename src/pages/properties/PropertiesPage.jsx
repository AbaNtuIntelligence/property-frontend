import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertiesPage.css';

// ===== FORMAT ZAR CURRENCY =====
const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function PropertiesPage() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await fetch(`${API_URL}/api/properties/`);
            if (response.ok) {
                const data = await response.json();
                setProperties(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (image) => {
        if (!image) return null;
        const imgUrl = image.image || image;
        if (!imgUrl) return null;
        return imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`;
    };

    const filteredProperties = properties.filter(prop => {
        if (filter === 'all') return true;
        if (filter === 'under10k') return prop.monthly_rent < 10000;
        if (filter === '10k-20k') return prop.monthly_rent >= 10000 && prop.monthly_rent <= 20000;
        if (filter === '20kplus') return prop.monthly_rent > 20000;
        if (filter === 'inverter') return prop.has_inverter;
        return true;
    });

    // SVG Icons
    const IconHome = () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );

    const IconBed = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8v11" />
            <path d="M21 8v11" />
            <rect x="3" y="6" width="18" height="6" rx="2" />
            <circle cx="8" cy="11" r="1" />
            <circle cx="16" cy="11" r="1" />
        </svg>
    );

    const IconBath = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="18" height="12" rx="2" />
            <path d="M8 20v-4" />
            <path d="M16 20v-4" />
            <path d="M3 14h18" />
            <path d="M6 6a3 3 0 0 1 6 0" />
            <path d="M6 10V6" />
        </svg>
    );

    const IconMapPin = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );

    const IconInverter = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );

    const IconSpinner = () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
        </svg>
    );

    if (loading) {
        return (
            <div className="properties-loading">
                <IconSpinner />
                <p>Loading properties...</p>
            </div>
        );
    }

    return (
        <div className="properties-page">
            <div className="properties-header">
                <h1>All Properties</h1>
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'under10k' ? 'active' : ''}`} 
                        onClick={() => setFilter('under10k')}
                    >
                        Under R10k
                    </button>
                    <button 
                        className={`filter-btn ${filter === '10k-20k' ? 'active' : ''}`} 
                        onClick={() => setFilter('10k-20k')}
                    >
                        R10k - R20k
                    </button>
                    <button 
                        className={`filter-btn ${filter === '20kplus' ? 'active' : ''}`} 
                        onClick={() => setFilter('20kplus')}
                    >
                        R20k+
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'inverter' ? 'active' : ''}`} 
                        onClick={() => setFilter('inverter')}
                    >
                        <IconInverter /> Inverter
                    </button>
                </div>
            </div>

            <div className="properties-grid">
                {filteredProperties.length === 0 ? (
                    <div className="no-properties">
                        <IconHome />
                        <h3>No properties found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                ) : (
                    filteredProperties.map(property => (
                        <div 
                            key={property.id} 
                            className="property-card" 
                            onClick={() => navigate(`/property/${property.id}`)}
                        >
                            <div className="property-image">
                                {property.images && property.images.length > 0 ? (
                                    <img src={getImageUrl(property.images[0])} alt={property.title} loading="lazy" />
                                ) : (
                                    <div className="no-image">
                                        <IconHome />
                                    </div>
                                )}
                            </div>
                            <div className="property-info">
                                <h3 className="property-title">{property.title}</h3>
                                <p className="property-price">
                                    {formatZAR(property.monthly_rent)}
                                    <span>/month</span>
                                </p>
                                <p className="property-location">
                                    <IconMapPin /> {property.city}
                                </p>
                                <div className="property-features">
                                    <span>
                                        <IconBed /> {property.bedrooms || 2} beds
                                    </span>
                                    <span>
                                        <IconBath /> {property.bathrooms || 2} baths
                                    </span>
                                    {property.has_inverter && (
                                        <span className="inverter-feature">
                                            <IconInverter /> Inverter
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}