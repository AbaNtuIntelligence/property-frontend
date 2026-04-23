import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Feed() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch(`${API_URL}/api/properties/`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading properties...</div>;

  return (
    <div>
      <h1>Welcome, {user?.username || 'User'}!</h1>
      <p>Found {properties.length} properties</p>
      {properties.map(p => (
        <div key={p.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{p.title}</h3>
          <p>${p.monthly_rent}/month - {p.city}</p>
        </div>
      ))}
    </div>
  );
}