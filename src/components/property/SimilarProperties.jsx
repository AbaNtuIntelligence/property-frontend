import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import propertyService from '../../pages/services/propertyService';
import { useWishlist } from '../../hooks/useWishlist';
import './SimilarProperties.css';

export default function SimilarProperties({ currentId, location, type }) {
    const navigate = useNavigate();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSimilarProperties();
    }, [currentId, location, type]);

    const fetchSimilarProperties = async () => {
        setLoading(true);
        try {
            // Fetch properties in same city or of same type
            const allProperties = await propertyService.getAllProperties();
            
            // Filter out current property and find similar ones
            const similar = allProperties
                .filter(p => p.id !== parseInt(currentId))
                .filter(p => p.city === location || p.property_type === type)
                .slice(0, 4); // Limit to 4 similar properties
            
            setProperties(similar);
        } catch (error) {
            console.error('Error fetching similar properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWishlistToggle = (propertyId, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isInWishlist(propertyId)) {
            removeFromWishlist(propertyId);
        } else {
            addToWishlist(propertyId);
        }
    };

    if (loading) {
        return (
            <div className="similar-properties-loading">
                <div className="loading-spinner-small"></div>
                <p>Loading similar properties...</p>
            </div>
        );
    }

    if (properties.length === 0) {
        return null; // Don't show section if no similar properties
    }

    return (
        <section className="similar-properties">
            <h2>Similar Properties</h2>
            <div className="similar-grid">
                {properties.map(property => (
                    <div 
                        key={property.id} 
                        className="similar-card"
                        onClick={() => navigate(`/property/${property.id}`)}
                    >
                        <div className="similar-image">
                            <img 
                                src={property.images?.[0]?.image || '/placeholder.jpg'} 
                                alt={property.title}
                            />
                            <button 
                                className={`wishlist-btn ${isInWishlist(property.id) ? 'active' : ''}`}
                                onClick={(e) => handleWishlistToggle(property.id, e)}
                            >
                                {isInWishlist(property.id) ? '❤️' : '🤍'}
                            </button>
                        </div>
                        <div className="similar-info">
                            <h3>{property.title}</h3>
                            <p className="location">{property.city}, {property.state}</p>
                            <p className="price">${property.monthly_rent}/month</p>
                            <div className="meta">
                                <span>{property.bedrooms} beds</span>
                                <span>{property.bathrooms} baths</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}