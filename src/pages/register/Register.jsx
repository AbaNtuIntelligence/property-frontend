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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

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
        setSuccess('Registration successful! Redirecting...');
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => navigate('/timeline'), 1500);
      } else {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : data.error || 'Registration failed';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '100px auto', padding: '20px' }}>
      <h1>Register</h1>
      {success && <div style={{ color: 'green', background: '#d4edda', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>{success}</div>}
      {error && <div style={{ color: 'red', background: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }} />
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }} />
        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }} />
        <input type="password" placeholder="Confirm Password" value={formData.password2} onChange={e => setFormData({...formData, password2: e.target.value})} required style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }} />
        <select value={formData.user_type} onChange={e => setFormData({...formData, user_type: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}>
          <option value="seeker">Property Seeker</option>
          <option value="owner">Property Owner</option>
        </select>
        <input type="tel" placeholder="Phone Number" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{loading ? 'Registering...' : 'Sign Up'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;