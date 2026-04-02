import React, { useState, useEffect } from 'react';
import propertyService from '../../pages/services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import './Properties.css';

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await propertyService.getAllProperties();
            setProperties(data);
            console.log('Properties loaded:', data);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading properties...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="properties-page">
            <h1>Available Properties</h1>
            {properties.length === 0 ? (
                <p className="no-properties">No properties available yet.</p>
            ) : (
                <div className="properties-grid">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}