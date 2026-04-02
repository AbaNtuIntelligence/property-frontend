import React, { useState } from 'react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-pattern"></div>
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-header">
            <span className="newsletter-badge">📧 STAY UPDATED</span>
            <h2>Stay in the Loop</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter for exclusive deals, travel tips, and inspiration
            </p>
          </div>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={error ? 'error' : ''}
                  disabled={loading}
                />
                <span className="input-icon">✉️</span>
                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="subscribe-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <span>Subscribe Now</span>
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Successfully Subscribed!</h3>
              <p>Thank you for joining our newsletter. You'll receive our next update with exclusive deals.</p>
              <div className="confetti">
                <span>🎉</span>
                <span>✨</span>
                <span>🎊</span>
              </div>
            </div>
          )}

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <span className="benefit-icon">🏷️</span>
              </div>
              <div className="benefit-text">
                <h4>Exclusive Deals</h4>
                <p>Member-only prices and early access</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <span className="benefit-icon">📝</span>
              </div>
              <div className="benefit-text">
                <h4>Travel Tips</h4>
                <p>Expert advice and local guides</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <span className="benefit-icon">🏠</span>
              </div>
              <div className="benefit-text">
                <h4>New Properties</h4>
                <p>First to know about new listings</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <span className="benefit-icon">🔔</span>
              </div>
              <div className="benefit-text">
                <h4>Price Alerts</h4>
                <p>Get notified when prices drop</p>
              </div>
            </div>
          </div>

          <div className="privacy-note">
            <span className="privacy-icon">🔒</span>
            <p>We respect your privacy. Unsubscribe at any time. No spam, ever.</p>
          </div>
        </div>
      </div>
    </section>
  );
}