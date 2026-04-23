import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // ✅ ALWAYS redirect to dashboard after login
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}