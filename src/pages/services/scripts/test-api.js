// scripts/test-api.js
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BACKEND_URL = process.env.VITE_API_URL || 'https://rental-backend-1-263v.onrender.com';

async function testAPI() {
  console.log(`\n🧪 Testing API Connection to: ${BACKEND_URL}\n`);
  
  const tests = [
    {
      name: 'Health Check',
      url: '/api/test/',
      method: 'GET'
    },
    {
      name: 'Properties Endpoint',
      url: '/api/properties/',
      method: 'GET'
    },
    {
      name: 'CORS Headers',
      url: '/api/test/',
      method: 'OPTIONS'
    }
  ];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios({
        method: test.method,
        url: `${BACKEND_URL}${test.url}`,
        timeout: 10000,
        headers: test.method === 'OPTIONS' ? {
          'Origin': 'https://property-frontend.netlify.app',
          'Access-Control-Request-Method': 'GET'
        } : {}
      });
      
      if (test.method === 'OPTIONS') {
        console.log(`✅ ${test.name}: CORS headers present`);
        console.log(`   Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin']}`);
      } else {
        console.log(`✅ ${test.name}: Success (${response.status})`);
        if (response.data) {
          console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Failed`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
      } else if (error.request) {
        console.log(`   Error: Cannot reach server - CORS or network issue`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
    console.log('');
  }
}

// Run the tests
testAPI();