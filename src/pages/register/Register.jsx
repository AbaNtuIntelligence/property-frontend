// src/pages/register/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); // Use the register from useAuth
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    user_type: 'seeker',
    phone_number: '',
    first_name: '',
    last_name: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  // SINGLE handleSubmit function - REMOVED THE DUPLICATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Call the register function from useAuth
      const result = await register(
        formData.email, 
        formData.password, 
        {
          fullName: `${formData.first_name} ${formData.last_name}`.trim() || formData.username,
          phone: formData.phone_number,
          userType: formData.user_type
        }
      );
      
      if (result.success) {
        // Upload profile image if selected (after successful registration)
        const token = localStorage.getItem('access_token');
        if (profileImage && token) {
          const uploadFormData = new FormData();
          uploadFormData.append('avatar', profileImage);
          
          try {
            await fetch(`${API_URL}/api/accounts/avatar/`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: uploadFormData
            });
          } catch (err) {
            console.error('Avatar upload failed:', err);
          }
        }
        
        setSuccess('Registration successful! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Cannot connect to backend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <Link to="/" className="back-link">← Back to home</Link>
            <div className="logo">🏠</div>
            <h1>Create account</h1>
            <p>Join PropertyRental community today</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
              <button className="alert-close" onClick={() => setError('')}>×</button>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Profile Picture Upload */}
            <div className="form-group profile-picture-group">
              <label className="form-label">Profile Picture</label>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile preview" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      <span className="placeholder-icon">📷</span>
                      <span>Add photo</span>
                    </div>
                  )}
                </div>
                <div className="avatar-upload-buttons">
                  <label className="upload-btn">
                    📸 Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {imagePreview && (
                    <button type="button" onClick={removeImage} className="remove-btn">
                      ✕ Remove
                    </button>
                  )}
                </div>
                <p className="upload-hint">JPEG, PNG, GIF up to 5MB</p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username *</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email *</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">✓</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password2"
                  placeholder="Confirm your password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="+1234567890"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* User Type */}
            <div className="form-group">
              <label className="form-label">I am a *</label>
              <div className="user-type-selector">
                <label className={`user-type-option ${formData.user_type === 'seeker' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="user_type"
                    value="seeker"
                    checked={formData.user_type === 'seeker'}
                    onChange={handleChange}
                  />
                  <span className="option-icon">🔍</span>
                  <span className="option-title">Property Seeker</span>
                  <span className="option-desc">Looking for a place to rent</span>
                </label>
                <label className={`user-type-option ${formData.user_type === 'owner' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="user_type"
                    value="owner"
                    checked={formData.user_type === 'owner'}
                    onChange={handleChange}
                  />
                  <span className="option-icon">🏠</span>
                  <span className="option-title">Property Owner</span>
                  <span className="option-desc">Have property to rent out</span>
                </label>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`register-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}