import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        user_type: 'seeker',
        phone_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image must be less than 5MB');
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = async (userId, token) => {
        if (!profileImage) return null;
        
        const formData = new FormData();
        formData.append('avatar', profileImage);
        
        try {
            const response = await fetch(`${API_URL}/api/accounts/upload-avatar/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.avatar_url;
            }
            return null;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/accounts/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    password2: formData.password2,
                    user_type: formData.user_type,
                    phone_number: formData.phone_number
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                
                if (profileImage) {
                    const avatarUrl = await uploadAvatar(data.user.id, data.access);
                    if (avatarUrl) {
                        data.user.avatar = avatarUrl;
                    }
                }
                
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccess('Registration successful! Redirecting...');
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setError(data.error || data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    // SVG Icon Components - Defined inline
    const CameraIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <circle cx="12" cy="12" r="4" />
            <line x1="17.5" y1="8.5" x2="17.51" y2="8.51" />
        </svg>
    );

    const UserIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    const MailIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7L12 13L2 7" />
        </svg>
    );

    const LockIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );

    const PhoneIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );

    const ArrowRightIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );

    const LogoIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <line x1="16" y1="3" x2="16" y2="7" />
            <line x1="8" y1="3" x2="8" y2="7" />
            <line x1="2" y1="9" x2="22" y2="9" />
            <path d="M8 13L13 18L20 11" />
        </svg>
    );

    const ErrorIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );

    const SuccessIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );

    const AvatarPlaceholderIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    const BenefitIconHome = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
        </svg>
    );

    const BenefitIconSecure = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );

    const BenefitIconSA = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff385c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
        </svg>
    );

    return (
        <div className="register-wrapper">
            <div className="register-container">
                {/* Left Panel - Brand */}
                <div className="register-left">
                    <div className="register-brand">
                        <div className="brand-icon">
                            <LogoIcon />
                        </div>
                        <h1>AbaNtu<span className="brand-highlight">Property</span></h1>
                        <p>Join South Africa's premier property community</p>
                    </div>

                    <div className="register-benefits">
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <BenefitIconHome />
                            </div>
                            <div>
                                <h4>Find Your Dream Home</h4>
                                <p>Browse thousands of properties across SA</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <BenefitIconSecure />
                            </div>
                            <div>
                                <h4>Secure & Trusted</h4>
                                <p>Verified listings and safe transactions</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <BenefitIconSA />
                            </div>
                            <div>
                                <h4>South African Owned</h4>
                                <p>Proudly serving our local community</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Registration Form */}
                <div className="register-right">
                    <div className="register-card">
                        <div className="register-header">
                            <h2>Create Account</h2>
                            <p>Start your property journey today</p>
                        </div>

                        {error && (
                            <div className="register-error">
                                <ErrorIcon />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="register-success">
                                <SuccessIcon />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="register-form">
                            {/* Avatar Upload */}
                            <div className="avatar-section">
                                <div className="avatar-preview">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile preview" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <AvatarPlaceholderIcon />
                                        </div>
                                    )}
                                </div>
                                <label className="upload-btn">
                                    <CameraIcon />
                                    <span>Upload Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <UserIcon />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <MailIcon />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password (min 6 characters)"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        name="password2"
                                        placeholder="Confirm password"
                                        value={formData.password2}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <select
                                    name="user_type"
                                    value={formData.user_type}
                                    onChange={handleChange}
                                    className="user-type-select"
                                >
                                    <option value="seeker">Property Seeker</option>
                                    <option value="owner">Property Owner</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <PhoneIcon />
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        placeholder="Phone number (optional)"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="register-btn">
                                {loading ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Sign Up
                                        <ArrowRightIcon />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="register-footer">
                            <p>
                                Already have an account? <Link to="/login">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}