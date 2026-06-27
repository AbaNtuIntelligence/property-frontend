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

    const getGoogleMapsUrl = () => {
        if (!property?.address && !property?.city) return null;
        const fullAddress = `${property.address}, ${property.city}, ${property.state || 'South Africa'}`;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    };

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

    // SVG Icons
    const IconArrowLeft = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );

    const IconArrowRight = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );

    const IconMapPin = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );

    const IconHome = () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );

    const IconBed = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8v11" />
            <path d="M21 8v11" />
            <rect x="3" y="6" width="18" height="6" rx="2" />
            <circle cx="8" cy="11" r="1" />
            <circle cx="16" cy="11" r="1" />
        </svg>
    );

    const IconBath = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="18" height="12" rx="2" />
            <path d="M8 20v-4" />
            <path d="M16 20v-4" />
            <path d="M3 14h18" />
            <path d="M6 6a3 3 0 0 1 6 0" />
            <path d="M6 10V6" />
        </svg>
    );

    const IconRuler = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <line x1="8" y1="8" x2="16" y2="16" />
            <line x1="16" y1="8" x2="8" y2="16" />
        </svg>
    );

    const IconTag = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    );

    const IconWhatsApp = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );

    const IconCheck = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );

    const IconClose = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );

    const IconInverter = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );

    const IconWater = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M12 2l7 7M12 2L5 7" />
        </svg>
    );

    const IconPet = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v1H7a3 3 0 0 0-3 3v1H3a1 1 0 0 0 0 2h1v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7h1a1 1 0 0 0 0-2h-1V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3z" />
        </svg>
    );

    const IconFurnished = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 21h8" />
            <path d="M12 21v-4" />
            <rect x="4" y="7" width="16" height="10" rx="2" />
            <path d="M4 12h16" />
        </svg>
    );

    const IconParking = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" />
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
            <div className="property-details-loading">
                <IconSpinner />
                <p>Loading property details...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="property-details-error">
                <IconHome />
                <h2>{error || 'Property not found'}</h2>
                <p>The property you're looking for doesn't exist or has been removed.</p>
                <button onClick={() => navigate('/timeline')} className="back-btn-primary">
                    <IconArrowLeft /> Back to Timeline
                </button>
            </div>
        );
    }

    const totalArea = property.total_area || calculateTotalAreaFromRooms();

    // Room name mappings
    const roomNames = {
        living_room: 'Living Room',
        master_bedroom: 'Master Bedroom',
        bedroom_2: 'Bedroom 2',
        bedroom_3: 'Bedroom 3',
        kitchen: 'Kitchen',
        dining_room: 'Dining Room',
        study: 'Study / Office'
    };

    const roomIcons = {
        living_room: <IconRuler />,
        master_bedroom: <IconRuler />,
        bedroom_2: <IconRuler />,
        bedroom_3: <IconRuler />,
        kitchen: <IconRuler />,
        dining_room: <IconRuler />,
        study: <IconRuler />
    };

    return (
        <div className="property-details-page">
            {/* Back Navigation */}
            <div className="back-nav">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <IconArrowLeft /> Back
                </button>
                <Link to="/timeline" className="browse-link">Browse all properties</Link>
            </div>

            <div className="property-details-container">
                {/* Image Gallery */}
                <div className="property-gallery">
                    {property.images && property.images.length > 0 ? (
                        <>
                            <div className="main-image-container">
                                <button className="gallery-nav prev" onClick={prevImage}>
                                    <IconArrowLeft />
                                </button>
                                <img 
                                    src={getImageUrl(property.images[currentImageIndex])} 
                                    alt={property.title}
                                    className="main-image"
                                    onClick={() => setShowFullGallery(true)}
                                />
                                <button className="gallery-nav next" onClick={nextImage}>
                                    <IconArrowRight />
                                </button>
                                <div className="image-counter">
                                    {currentImageIndex + 1} / {property.images.length}
                                </div>
                                <button className="expand-gallery" onClick={() => setShowFullGallery(true)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
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
                            <IconHome />
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
                            <IconMapPin /> {property.address}, {property.city}, {property.state || 'South Africa'}
                        </div>
                        <div className="property-status">
                            <span className={`status-badge ${property.status || 'available'}`}>
                                {property.status === 'available' ? 'Available Now' : 
                                 property.status === 'rented' ? 'Rented' : 
                                 'Under Maintenance'}
                            </span>
                        </div>
                    </div>

                    {/* Key Specs */}
                    <div className="property-specs">
                        <div className="spec-card">
                            <IconBed />
                            <div className="spec-info">
                                <div className="spec-value">{property.bedrooms}</div>
                                <div className="spec-label">Bedrooms</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <IconBath />
                            <div className="spec-info">
                                <div className="spec-value">{property.bathrooms}</div>
                                <div className="spec-label">Bathrooms</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <IconRuler />
                            <div className="spec-info">
                                <div className="spec-value">{totalArea || '—'}</div>
                                <div className="spec-label">Total Area (m²)</div>
                            </div>
                        </div>
                        <div className="spec-card">
                            <IconTag />
                            <div className="spec-info">
                                <div className="spec-value">{property.property_type || 'Apartment'}</div>
                                <div className="spec-label">Property Type</div>
                            </div>
                        </div>
                    </div>

                    {/* Full Address with Google Maps */}
                    {(property.address || property.city) && (
                        <div className="property-address-section">
                            <h3>Location</h3>
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
                                        <IconMapPin /> Open in Google Maps
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {property.description && (
                        <div className="property-description">
                            <h3>Description</h3>
                            <p>{property.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                        <div className="property-amenities">
                            <h3>Amenities</h3>
                            <div className="amenities-grid">
                                {property.amenities.map((amenity, idx) => (
                                    <div key={idx} className="amenity-item">
                                        <IconCheck />
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Special Features */}
                    <div className="special-features">
                        <h3>Special Features</h3>
                        <div className="features-grid">
                            {property.has_inverter && (
                                <div className="feature-item">
                                    <IconInverter />
                                    <div>
                                        <strong>Inverter Backup</strong>
                                        <p>Load shedding protection</p>
                                    </div>
                                </div>
                            )}
                            {property.has_jojo_tank && (
                                <div className="feature-item">
                                    <IconWater />
                                    <div>
                                        <strong>JoJo Tank</strong>
                                        <p>Water backup system</p>
                                    </div>
                                </div>
                            )}
                            {property.pet_friendly && (
                                <div className="feature-item">
                                    <IconPet />
                                    <div>
                                        <strong>Pet Friendly</strong>
                                        <p>Pets allowed</p>
                                    </div>
                                </div>
                            )}
                            {property.furnished && (
                                <div className="feature-item">
                                    <IconFurnished />
                                    <div>
                                        <strong>Furnished</strong>
                                        <p>Fully furnished property</p>
                                    </div>
                                </div>
                            )}
                            {property.parking && (
                                <div className="feature-item">
                                    <IconParking />
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
                            <h3>Room Dimensions</h3>
                            <div className="dimensions-grid-detail">
                                {Object.entries(property.room_dimensions).map(([room, dims]) => {
                                    if (!dims.length || !dims.width) return null;
                                    const area = (parseFloat(dims.length) * parseFloat(dims.width)).toFixed(1);
                                    return (
                                        <div key={room} className="dimension-card-detail">
                                            <div className="dimension-icon">{roomIcons[room] || <IconRuler />}</div>
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
                        <h3>Contact Property Owner</h3>
                        <button className="whatsapp-contact-large" onClick={handleWhatsAppContact}>
                            <IconWhatsApp /> Contact via WhatsApp
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
                        <button className="close-gallery" onClick={() => setShowFullGallery(false)}>
                            <IconClose />
                        </button>
                        <img 
                            src={getImageUrl(property.images[currentImageIndex])} 
                            alt={property.title}
                            className="full-gallery-image"
                        />
                        <button className="full-gallery-nav prev" onClick={prevImage}>
                            <IconArrowLeft />
                        </button>
                        <button className="full-gallery-nav next" onClick={nextImage}>
                            <IconArrowRight />
                        </button>
                        <div className="full-gallery-counter">
                            {currentImageIndex + 1} / {property.images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}