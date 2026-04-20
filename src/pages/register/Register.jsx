import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    user_type: 'seeker',
    phone_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate passwords match
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/accounts/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setMessage('Registration successful! Redirecting to dashboard...');
        
        // Store tokens and user data
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect after 2 seconds
        setTimeout(() => {
          if (data.user.user_type === 'owner') {
            navigate('/dashboard/owner');
          } else {
            navigate('/dashboard/seeker');
          }
        }, 1500);
      } else {
        // Handle error response
        if (data.error) {
          setError(data.error);
        } else if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Cannot connect to backend. Make sure Django is running on port 8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h1>Register for Property Rental</h1>
      
      {message && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={(e) => setFormData({...formData, password2: e.target.value})}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        
        <div>
          <select
            value={formData.user_type}
            onChange={(e) => setFormData({...formData, user_type: e.target.value})}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="seeker">Property Seeker (I want to rent)</option>
            <option value="owner">Property Owner (I want to list properties)</option>
          </select>
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;