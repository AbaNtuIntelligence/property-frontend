import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../pages/services/propertyService';
import './PropertyForm.css';

export default function PropertyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        property_type: 'APARTMENT',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'USA',
        bedrooms: 1,
        bathrooms: 1,
        square_feet: 500,
        monthly_rent: '',
        security_deposit: '',
        amenities: [],
        images: []
    });

    const propertyTypes = [
        { value: 'APARTMENT', label: 'Apartment' },
        { value: 'HOUSE', label: 'House' },
        { value: 'CONDO', label: 'Condo' },
        { value: 'STUDIO', label: 'Studio' },
        { value: 'ROOM', label: 'Room' }
    ];

    const amenityOptions = [
        'WiFi',
        'Parking',
        'Kitchen',
        'Washer',
        'Dryer',
        'AC',
        'Heating',
        'TV',
        'Pool',
        'Gym',
        'Pet Friendly',
        'Smoking Allowed',
        'Workspace',
        'Balcony',
        'Garden'
    ];

    useEffect(() => {
        if (id) {
            fetchProperty();
        }
    }, [id]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            const data = await propertyService.getPropertyById(id);
            
            // Check if user owns this property
            if (data.owner !== user?.id) {
                navigate('/unauthorized');
                return;
            }
            
            setFormData(data);
        } catch (err) {
            setError('Failed to load property');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value)
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        // Handle image upload - you'll need to implement this with your backend
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate form
            if (!formData.title || !formData.description || !formData.monthly_rent) {
                throw new Error('Please fill in all required fields');
            }

            // Create FormData for multipart/form-data if uploading images
            const submitData = new FormData();
            
            // Add all form fields
            Object.keys(formData).forEach(key => {
                if (key === 'amenities') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key === 'images') {
                    formData.images.forEach((image, index) => {
                        if (image instanceof File) {
                            submitData.append(`image_${index}`, image);
                        }
                    });
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            let response;
            if (id) {
                response = await propertyService.updateProperty(id, submitData);
            } else {
                response = await propertyService.createProperty(submitData);
            }

            // Redirect to property detail page
            navigate(`/property/${response.id || id}`);
        } catch (err) {
            setError(err.message || 'Failed to save property');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return (
            <div className="property-form-loading">
                <div className="loading-spinner"></div>
                <p>Loading property...</p>
            </div>
        );
    }

    return (
        <div className="property-form-container">
            <div className="property-form-header">
                <h1>{id ? 'Edit Property' : 'List Your Property'}</h1>
                <p className="form-subtitle">
                    {id ? 'Update your property information' : 'Fill in the details to list your property for rent'}
                </p>
            </div>

            {error && (
                <div className="form-error">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="property-form">
                {/* Basic Information */}
                <section className="form-section">
                    <h2>Basic Information</h2>
                    
                    <div className="form-group">
                        <label htmlFor="title">
                            Property Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Beautiful Downtown Apartment"
                            required
                            maxLength={200}
                        />
                        <small className="field-hint">Choose a catchy title that highlights your property</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your property, its unique features, and what makes it special..."
                            required
                            rows={6}
                            maxLength={2000}
                        />
                        <small className="field-hint">{formData.description.length}/2000 characters</small>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="property_type">Property Type</label>
                            <select
                                id="property_type"
                                name="property_type"
                                value={formData.property_type}
                                onChange={handleChange}
                            >
                                {propertyTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Location Details */}
                <section className="form-section">
                    <h2>Location</h2>
                    
                    <div className="form-group">
                        <label htmlFor="address">Street Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street address"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="zip_code">ZIP Code</label>
                            <input
                                type="text"
                                id="zip_code"
                                name="zip_code"
                                value={formData.zip_code}
                                onChange={handleChange}
                                placeholder="ZIP Code"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </section>

                {/* Property Details */}
                <section className="form-section">
                    <h2>Property Details</h2>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="bedrooms">Bedrooms</label>
                            <input
                                type="number"
                                id="bedrooms"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleNumberChange}
                                min="0"
                                max="10"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <input
                                type="number"
                                id="bathrooms"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleNumberChange}
                                min="0.5"
                                max="10"
                                step="0.5"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="square_feet">Square Feet</label>
                            <input
                                type="number"
                                id="square_feet"
                                name="square_feet"
                                value={formData.square_feet}
                                onChange={handleNumberChange}
                                min="0"
                                step="10"
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="form-section">
                    <h2>Pricing</h2>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="monthly_rent">
                                Monthly Rent ($) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="monthly_rent"
                                name="monthly_rent"
                                value={formData.monthly_rent}
                                onChange={handleNumberChange}
                                min="0"
                                step="50"
                                placeholder="2500"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="security_deposit">Security Deposit ($)</label>
                            <input
                                type="number"
                                id="security_deposit"
                                name="security_deposit"
                                value={formData.security_deposit}
                                onChange={handleNumberChange}
                                min="0"
                                step="50"
                                placeholder="2500"
                            />
                            <small className="field-hint">Usually equal to one month's rent</small>
                        </div>
                    </div>
                </section>

                {/* Amenities */}
                <section className="form-section">
                    <h2>Amenities</h2>
                    <p className="section-hint">Select all amenities that your property offers</p>
                    
                    <div className="amenities-grid">
                        {amenityOptions.map(amenity => (
                            <label key={amenity} className="amenity-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.amenities.includes(amenity)}
                                    onChange={() => handleAmenityToggle(amenity)}
                                />
                                <span>{amenity}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Images */}
                <section className="form-section">
                    <h2>Property Images</h2>
                    <p className="section-hint">Upload photos of your property (max 10 images)</p>
                    
                    <div className="image-upload-area">
                        <input
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="file-input"
                        />
                        <label htmlFor="images" className="upload-label">
                            <span className="upload-icon">📸</span>
                            <span>Click to upload images</span>
                            <small>or drag and drop</small>
                        </label>
                    </div>

                    {formData.images.length > 0 && (
                        <div className="image-preview-grid">
                            {formData.images.map((image, index) => (
                                <div key={index} className="image-preview">
                                    <img
                                        src={image instanceof File ? URL.createObjectURL(image) : image.image || image}
                                        alt={`Property ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => removeImage(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="btn-spinner"></span>
                                {id ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            id ? 'Update Property' : 'List Property'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}