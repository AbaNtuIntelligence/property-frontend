import React, { useState, useEffect } from 'react';

function ConnectionTest() {
  const [backendStatus, setBackendStatus] = useState('testing');
  const [message, setMessage] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setBackendStatus('testing');
    setApiUrl(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
    
    try {
      const response = await fetch(`${apiUrl}/api/accounts/test/`);
      
      if (response.ok) {
        setBackendStatus('connected');
        setMessage('✅ Successfully connected to backend!');
      } else {
        setBackendStatus('failed');
        setMessage('❌ Cannot connect to backend.');
      }
    } catch (error) {
      setBackendStatus('failed');
      setMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  const getStatusColor = () => {
    switch(backendStatus) {
      case 'connected': return 'green';
      case 'failed': return 'red';
      case 'testing': return 'orange';
      default: return 'gray';
    }
  };

  // Only show in development
  if (import.meta.env.PROD && !window.location.search.includes('debug')) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'white',
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '5px',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      fontFamily: 'monospace'
    }}>
      <div><strong>🔌 API Connection Test</strong></div>
      <div>🌍 Mode: {import.meta.env.MODE}</div>
      <div>📍 API URL: {apiUrl}</div>
      <div>💚 Status: 
        <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
          {backendStatus}
        </span>
      </div>
      <div>{message}</div>
      <button 
        onClick={testConnection}
        style={{ marginTop: '5px', padding: '2px 5px', fontSize: '11px', cursor: 'pointer' }}
      >
        Retest
      </button>
    </div>
  );
}

export default ConnectionTest;