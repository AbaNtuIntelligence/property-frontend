import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertiesPage.css';

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

    if (loading) {
        return <div className="properties-loading">Loading properties...</div>;
    }

    return (
        <div className="properties-page">
            <div className="properties-header">
                <h1>All Properties</h1>
                <div className="filter-buttons">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`filter-btn ${filter === 'under10k' ? 'active' : ''}`} onClick={() => setFilter('under10k')}>Under R10k</button>
                    <button className={`filter-btn ${filter === '10k-20k' ? 'active' : ''}`} onClick={() => setFilter('10k-20k')}>R10k - R20k</button>
                    <button className={`filter-btn ${filter === '20kplus' ? 'active' : ''}`} onClick={() => setFilter('20kplus')}>R20k+</button>
                    <button className={`filter-btn ${filter === 'inverter' ? 'active' : ''}`} onClick={() => setFilter('inverter')}>🔋 Inverter</button>
                </div>
            </div>

            <div className="properties-grid">
                {filteredProperties.length === 0 ? (
                    <div className="no-properties">No properties found.</div>
                ) : (
                    filteredProperties.map(property => (
                        <div key={property.id} className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
                            <div className="property-image">
                                {property.images && property.images.length > 0 ? (
                                    <img src={getImageUrl(property.images[0])} alt={property.title} />
                                ) : (
                                    <div className="no-image">🏠</div>
                                )}
                            </div>
                            <div className="property-info">
                                <h3>{property.title}</h3>
                                <p className="price">{formatZAR(property.monthly_rent)}<span>/month</span></p>
                                <p className="location">📍 {property.city}</p>
                                <div className="features">
                                    <span>🛏️ {property.bedrooms || 2} beds</span>
                                    <span>🛁 {property.bathrooms || 2} baths</span>
                                    {property.has_inverter && <span>🔋 Inverter</span>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}