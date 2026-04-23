import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading property details...</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{property.title}</h1>
      <p><strong>💰 Price:</strong> ${property.monthly_rent}/month</p>
      <p><strong>📍 Location:</strong> {property.city}</p>
      <p><strong>📝 Description:</strong> {property.description}</p>
    </div>
  );
}