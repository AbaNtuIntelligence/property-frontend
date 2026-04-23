import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Browse Properties</h1>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {properties.map(property => (
            <div key={property.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: 'white' }}>
              <h3>{property.title}</h3>
              <p>💰 ${property.monthly_rent}/month</p>
              <p>📍 {property.city}</p>
              <button 
                onClick={() => navigate(`/property/${property.id}`)}
                style={{ background: '#007bff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}