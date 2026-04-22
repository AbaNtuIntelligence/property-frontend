import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔑 Where user was trying to go
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(formData.username, formData.password);

      const userType = data.user?.user_type?.toUpperCase();

      // 🎯 Intent-first redirect
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // 🧠 Role-based fallback
      if (userType === 'OWNER') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/properties', { replace: true });
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h1>Login</h1>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
          style={{ width: '100%', padding: '8px', margin: '5px 0' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          style={{ width: '100%', padding: '8px', margin: '5px 0' }}
        />

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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;