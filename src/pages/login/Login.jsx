import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon">🏠</div>
            <h1>Property<span className="brand-highlight">Rental</span></h1>
            <p>Find your dream home in South Africa</p>
          </div>
          <div className="login-features">
            <div className="feature">
              <span className="feature-icon">🔍</span>
              <span>Thousands of properties</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Secure transactions</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🏠</span>
              <span>Verified listings</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🇿🇦</span>
              <span>South African owned</span>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Username or Email</label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
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

              <div className="form-options">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button 
                type="submit" 
                className={`login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-btn google">
                <span>G</span> Google
              </button>
              <button className="social-btn facebook">
                <span>f</span> Facebook
              </button>
            </div>

            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials</p>
              <div className="demo-buttons">
                <button 
                  type="button"
                  className="demo-btn owner"
                  onClick={() => handleDemoLogin('john_owner', 'TestPass123')}
                >
                  🏠 Property Owner
                </button>
                <button 
                  type="button"
                  className="demo-btn seeker"
                  onClick={() => handleDemoLogin('jane_seeker', 'TestPass123')}
                >
                  🔍 Property Seeker
                </button>
              </div>
            </div>

            <div className="login-footer">
              <p>
                Don't have an account? <Link to="/register">Sign up now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}