import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyCard.css';

export default function PropertyCard({ property }) {
    const navigate = useNavigate();

    return (
        <div className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
            <div className="property-image">
                <img 
                    src={property.images?.[0]?.image || '/placeholder-house.jpg'} 
                    alt={property.title}
                />
            </div>
            <div className="property-info">
                <h3>{property.title}</h3>
                <p className="location">{property.city}, {property.state}</p>
                <p className="price">${property.monthly_rent}/month</p>
                <div className="details">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.square_feet} sq ft</span>
                </div>
            </div>
        </div>
    );
}