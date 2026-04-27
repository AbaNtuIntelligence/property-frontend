// src/pages/property-detail/PropertyDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './PropertyDetailsPage.css';

const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function PropertyDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullGallery, setShowFullGallery] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    useEffect(() => {
        fetchPropertyDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchPropertyDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/properties/`);
            
            if (response.ok) {
                const allProperties = await response.json();
                const foundProperty = allProperties.find(p => String(p.id) === String(id));
                
                if (foundProperty) {
                    setProperty(foundProperty);
                    setError('');
                } else {
                    setError('Property not found');
                }
            } else {
                setError('Failed to load properties');
            }
        } catch (err) {
            console.error('Error fetching property:', err);
            setError('Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppContact = () => {
        if (!property?.whatsapp_number) {
            alert('No WhatsApp number provided for this property owner.');
            return;
        }
        
        let formattedNumber = property.whatsapp_number.replace(/\s/g, '');
        if (formattedNumber.startsWith('0')) {
            formattedNumber = '27' + formattedNumber.substring(1);
        }
        if (!formattedNumber.startsWith('27')) {
            formattedNumber = '27' + formattedNumber;
        }
        
        const message = encodeURIComponent(
            `Hi! I'm interested in your property: ${property.title}. Is it still available?\n\n` +
            `Location: ${property.address}, ${property.city}\n` +
            `Rent: ${formatZAR(property.monthly_rent)}/month\n` +
            `Bedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms}`
        );
        
        window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
    };

    const nextImage = () => {
        if (property?.images && currentImageIndex < property.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else if (property?.images) {
            setCurrentImageIndex(0);
        }
    };

    const prevImage = () => {
        if (property?.images && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else if (property?.images) {
            setCurrentImageIndex(property.images.length - 1);
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        const imgUrl = img.image || img;
        if (!imgUrl) return null;
        if (imgUrl.startsWith('http')) return imgUrl;
        return `${API_URL}${imgUrl}`;
    };

    // Generate Google Maps URL
    const getGoogleMapsUrl = () => {
        if (!property?.address && !property?.city) return null;
        const fullAddress = `${property.address}, ${property.city}, ${property.state || 'South Africa'}`;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    };

    // Calculate total area from room dimensions
    const calculateTotalAreaFromRooms = () => {
        if (!property?.room_dimensions) return null;
        
        let total = 0;
        Object.values(property.room_dimensions).forEach(room => {
            if (room.length && room.width) {
                total += parseFloat(room.length) * parseFloat(room.width);
            }
        });
        return total.toFixed(1);
    };

    if (loading) {
        return (
            <div className="property-details-loading">
                <div className="loading-spinner"></div>
                <p>Loading property details...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="property-details-error">
                <div className="error-icon">🏠</div>
                <h2>{error || 'Property not found'}</h2>
                <p>The property you're looking for doesn't exist or has been removed.</p>
                <button onClick={() => navigate('/timeline')} className="back-btn">
                    ← Back to Timeline
                </button>
            </div>
        );
    }

    const totalArea = property.total_area || calculateTotalAreaFromRooms();

    return (
        <div className="property-details-page">
            {/* Back Navigation */}
            <div className="back-nav">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Back
                </button>
                <Link to="/timeline" className="browse-link">Browse all properties</Link>
            </div>

            <div className="property-details-container">
                {/* Image Gallery */}
                <div className="property-gallery">
                    {property.images && property.images.length > 0 ? (
                        <>
                            <div className="main-image-container">
                                <button className="gallery-nav prev" onClick={prevImage}>❮</button>
                                <img 
                                    src={getImageUrl(property.images[currentImageIndex])} 
                                    alt={property.title}
                                    className="main-image"
                                    onClick={() => setShowFullGallery(true)}
                                />
                                <button className="gallery-nav next" onClick={nextImage}>❯</button>
                                <div className="image-counter">
                                    {currentImageIndex + 1} / {property.images.length}
                                </div>
                                <button className="expand-gallery" onClick={() => setShowFullGallery(true)}>
                                    🔍
                                </button>
                            </div>
                            <div className="thumbnail-strip">
                                {property.images.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                    >
                                        <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="no-images-placeholder">
                            <span>🏠</span>
                            <p>No images available</p>
                        </div>
                    )}
                </div>

                {/* Property Info Section */}
                <div className="property-info-section">
                    {/* Header */}
                    <div className="property-header">
                        <h1 className="property-title">{property.title}</h1>
                        <div className="property-price-large">{formatZAR(property.monthly_rent)}<span>/month</span></div>
                        <div className="property-location">
                            📍 {property.address}, {property.city}, {property.state || 'South Africa'}
                        </div>
                        <div className="property-status">
                            <span className={`status-badge ${property.status || 'available'}`}>
                                {property.status === 'available' ? '✅ Available Now' : 
                                 property.status === 'rented' ? '🔴 Rented' : 
                                 '🛠️ Under Maintenance'}
                            </span>
                        </div>
                    </div>

                    {/* Key Specs */}
                    <div className="property-specs">
                        <div className="spec-card">
                            <span className="spec-icon">🛏️</span>
                            <div className="spec-info">
                                <div className="spec-value">{property.bedrooms}</div>
                                <div className="spec-label">Bedrooms</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <span className="spec-icon">🛁</span>
                            <div className="spec-info">
                                <div className="spec-value">{property.bathrooms}</div>
                                <div className="spec-label">Bathrooms</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <span className="spec-icon">📐</span>
                            <div className="spec-info">
                                <div className="spec-value">{totalArea || '—'}</div>
                                <div className="spec-label">Total Area (m²)</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <span className="spec-icon">🏷️</span>
                            <div className="spec-info">
                                <div className="spec-value">{property.property_type || 'Apartment'}</div>
                                <div className="spec-label">Property Type</div>
                            </div>
                        </div>
                    </div>

                    {/* Full Address with Google Maps */}
                    {(property.address || property.city) && (
                        <div className="property-address-section">
                            <h3>📍 Full Address</h3>
                            <div className="address-card">
                                <div className="address-details">
                                    <p><strong>Street:</strong> {property.address || 'Not specified'}</p>
                                    <p><strong>City:</strong> {property.city || 'Not specified'}</p>
                                    <p><strong>Province:</strong> {property.state || 'Not specified'}</p>
                                    <p><strong>Postal Code:</strong> {property.zip_code || 'Not specified'}</p>
                                </div>
                                {getGoogleMapsUrl() && (
                                    <a 
                                        href={getGoogleMapsUrl()} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="google-maps-btn"
                                    >
                                        🗺️ Open in Google Maps
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {property.description && (
                        <div className="property-description">
                            <h3>📝 Description</h3>
                            <p>{property.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                        <div className="property-amenities">
                            <h3>✨ Amenities</h3>
                            <div className="amenities-grid">
                                {property.amenities.map((amenity, idx) => (
                                    <div key={idx} className="amenity-item">
                                        <span className="amenity-check">✓</span>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Special Features */}
                    <div className="special-features">
                        <h3>⚡ Special Features</h3>
                        <div className="features-grid">
                            {property.has_inverter && (
                                <div className="feature-item">
                                    <span>🔋</span>
                                    <div>
                                        <strong>Inverter Backup</strong>
                                        <p>Load shedding protection</p>
                                    </div>
                                </div>
                            )}
                            {property.has_jojo_tank && (
                                <div className="feature-item">
                                    <span>💧</span>
                                    <div>
                                        <strong>JoJo Tank</strong>
                                        <p>Water backup system</p>
                                    </div>
                                </div>
                            )}
                            {property.pet_friendly && (
                                <div className="feature-item">
                                    <span>🐾</span>
                                    <div>
                                        <strong>Pet Friendly</strong>
                                        <p>Pets allowed</p>
                                    </div>
                                </div>
                            )}
                            {property.furnished && (
                                <div className="feature-item">
                                    <span>🛋️</span>
                                    <div>
                                        <strong>Furnished</strong>
                                        <p>Fully furnished property</p>
                                    </div>
                                </div>
                            )}
                            {property.parking && (
                                <div className="feature-item">
                                    <span>🅿️</span>
                                    <div>
                                        <strong>Parking</strong>
                                        <p>{property.parking_type || 'Parking available'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Room Dimensions */}
                    {property.room_dimensions && Object.keys(property.room_dimensions).length > 0 && (
                        <div className="room-dimensions-section-detail">
                            <h3>📐 Room Dimensions</h3>
                            <div className="dimensions-grid-detail">
                                {Object.entries(property.room_dimensions).map(([room, dims]) => {
                                    if (!dims.length || !dims.width) return null;
                                    const area = (parseFloat(dims.length) * parseFloat(dims.width)).toFixed(1);
                                    const roomNames = {
                                        living_room: 'Living Room',
                                        master_bedroom: 'Master Bedroom',
                                        bedroom_2: 'Bedroom 2',
                                        bedroom_3: 'Bedroom 3',
                                        kitchen: 'Kitchen',
                                        dining_room: 'Dining Room',
                                        study: 'Study/Office'
                                    };
                                    const icons = {
                                        living_room: '🛋️',
                                        master_bedroom: '👑',
                                        bedroom_2: '🛏️',
                                        bedroom_3: '🛏️',
                                        kitchen: '🍳',
                                        dining_room: '🍽️',
                                        study: '📚'
                                    };
                                    return (
                                        <div key={room} className="dimension-card-detail">
                                            <div className="dimension-icon">{icons[room] || '📐'}</div>
                                            <div className="dimension-detail">
                                                <div className="dimension-name">{roomNames[room] || room}</div>
                                                <div className="dimension-size">{dims.length} × {dims.width} m</div>
                                            </div>
                                            <div className="dimension-area">{area} m²</div>
                                        </div>
                                    );
                                })}
                            </div>
                            {totalArea && (
                                <div className="total-area-note">
                                    <strong>Total living area:</strong> {totalArea} m²
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contact Section */}
                    <div className="contact-section">
                        <h3>📞 Contact Property Owner</h3>
                        <button className="whatsapp-contact-large" onClick={handleWhatsAppContact}>
                            <span>📱</span> Contact via WhatsApp
                        </button>
                        {property.whatsapp_number && (
                            <p className="whatsapp-note">
                                <small>The owner will respond via WhatsApp</small>
                            </p>
                        )}
                        {!user && (
                            <p className="login-prompt">
                                <Link to="/login">Login</Link> to save this property
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Gallery Modal */}
            {showFullGallery && property.images && property.images.length > 0 && (
                <div className="full-gallery-modal" onClick={() => setShowFullGallery(false)}>
                    <div className="full-gallery-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-gallery" onClick={() => setShowFullGallery(false)}>✕</button>
                        <img 
                            src={getImageUrl(property.images[currentImageIndex])} 
                            alt={property.title}
                            className="full-gallery-image"
                        />
                        <button className="full-gallery-nav prev" onClick={prevImage}>❮</button>
                        <button className="full-gallery-nav next" onClick={nextImage}>❯</button>
                        <div className="full-gallery-counter">
                            {currentImageIndex + 1} / {property.images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}