import React, { useState, useEffect } from 'react';
import './Timeline.css';

export default function Timeline() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    
    try {
      const url = `${API_URL}/api/properties/`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading properties...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>❌ Error: {error}</p>
        <button onClick={fetchProperties}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '80px auto 20px', padding: '20px' }}>
      <h1>Properties for Rent</h1>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        properties.map(property => (
          <div key={property.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            background: 'white'
          }}>
            <h3>{property.title}</h3>
            <p>💰 ${property.monthly_rent}/month</p>
            <p>📍 {property.city}</p>
            <p>{property.description}</p>
          </div>
        ))
      )}
    </div>
  );
}