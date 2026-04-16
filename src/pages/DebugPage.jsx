// src/pages/DebugPage.jsx
import React, { useState, useEffect } from 'react';
import { apiService, authService } from './services';

function DebugPage() {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const runAllTests = async () => {
    setLoading(true);
    const results = {};
    
    // Test 1: Environment
    results.environment = {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      apiUrl: import.meta.env.VITE_API_URL,
      hasToken: !!localStorage.getItem('access_token')
    };
    
    // Test 2: Backend connection
    try {
      const connection = await apiService.checkConnection();
      results.backend = { status: 'connected', data: connection };
    } catch (error) {
      results.backend = { status: 'failed', error: error.message };
    }
    
    // Test 3: Auth status
    results.auth = {
      isAuthenticated: authService.isAuthenticated(),
      hasToken: !!localStorage.getItem('access_token'),
      user: localStorage.getItem('user')
    };
    
    // Test 4: Local storage
    results.localStorage = {
      hasAccessToken: !!localStorage.getItem('access_token'),
      hasRefreshToken: !!localStorage.getItem('refresh_token'),
      hasUser: !!localStorage.getItem('user')
    };
    
    setDebugInfo(results);
    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  if (loading) {
    return <div className="p-8">Running tests...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔧 Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Environment</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(debugInfo.environment, null, 2)}
        </pre>
      </div>
      
      <div className={`p-4 rounded-lg mb-4 ${debugInfo.backend?.status === 'connected' ? 'bg-green-100' : 'bg-red-100'}`}>
        <h2 className="font-semibold mb-2">Backend Connection</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(debugInfo.backend, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Authentication</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(debugInfo.auth, null, 2)}
        </pre>
      </div>
      
      <button 
        onClick={runAllTests}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Tests Again
      </button>
    </div>
  );
}

export default DebugPage;