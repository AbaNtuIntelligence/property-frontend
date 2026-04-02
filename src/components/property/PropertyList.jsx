import React, { useState, useEffect } from 'react';
import propertyService from '../../pages/services/propertyService';
import authService from '../../pages/services/authService';

function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await propertyService.getAllProperties();
            setProperties(data);
        } catch (err) {
            setError('Failed to load properties');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading properties...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="property-list">
            <div className="header">
                <h2>Available Properties</h2>
                {user?.user_type === 'OWNER' && (
                    <button onClick={() => window.location.href = '/property/new'}>
                        Add New Property
                    </button>
                )}
            </div>
            <div className="properties-grid">
                {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}

function PropertyCard({ property }) {
    const user = authService.getCurrentUser();
    
    return (
        <div className="property-card">
            <h3>{property.title}</h3>
            <p className="price">${property.monthly_rent}/month</p>
            <p className="location">{property.city}, {property.state}</p>
            <p className="details">
                {property.bedrooms} beds | {property.bathrooms} baths | {property.square_feet} sq ft
            </p>
            <div className="card-actions">
                <button onClick={() => window.location.href = `/property/${property.id}`}>
                    View Details
                </button>
                {user?.user_type === 'SEEKER' && (
                    <button className="inquire-btn">Inquire</button>
                )}
            </div>
        </div>
    );
}

export default PropertyList;