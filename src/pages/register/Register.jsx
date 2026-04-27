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
            // Register user
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
                // Store tokens
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                
                // Upload avatar if selected
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

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Create Account</h1>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    {/* Profile Picture */}
                    <div className="avatar-upload">
                        <div className="avatar-preview">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" />
                            ) : (
                                <div className="avatar-placeholder">📷</div>
                            )}
                        </div>
                        <label className="upload-btn">
                            Choose Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                    >
                        <option value="seeker">Property Seeker</option>
                        <option value="owner">Property Owner</option>
                    </select>
                    <input
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number (optional)"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}