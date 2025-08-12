import React, { useState } from 'react';
import { stationEndpoints, geocodingEndpoints } from '../../services/api';
import { apiConnector } from '../../services/apiconnector';

const APITester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, method, url, data = null) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    
    try {
      console.log(`Testing ${name}:`, { method, url, data });
      
      const response = await apiConnector(method, url, data);
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          status: response.status,
          data: response.data,
          message: 'Success'
        }
      }));
      
      console.log(`${name} success:`, response.data);
    } catch (error) {
      console.error(`${name} error:`, error);
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          status: error.response?.status || 'Network Error',
          data: error.response?.data || null,
          message: error.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'Geocoding - Patna',
      method: 'GET',
      url: geocodingEndpoints.GEOCODE_ADDRESS_API,
      params: { address: 'Patna' }
    },
    {
      name: 'Get All Stations',
      method: 'GET',
      url: stationEndpoints.GET_ALL_STATION,
      data: null
    },
    {
      name: 'Get Stations by Location',
      method: 'POST',
      url: stationEndpoints.GET_STATION_BY_LOCATION,
      data: {
        latitude: 25.5941,
        longitude: 85.1376,
        radius: 100
      }
    }
  ];

  const runTest = (test) => {
    if (test.method === 'GET' && test.params) {
      // For GET requests with params, we need to handle them differently
      const urlWithParams = new URL(test.url);
      Object.keys(test.params).forEach(key => {
        urlWithParams.searchParams.append(key, test.params[key]);
      });
      testEndpoint(test.name, test.method, urlWithParams.toString());
    } else {
      testEndpoint(test.name, test.method, test.url, test.data);
    }
  };

  const runAllTests = () => {
    tests.forEach(test => runTest(test));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Endpoint Tester</h2>
      
      <div className="mb-4">
        <button
          onClick={runAllTests}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Run All Tests
        </button>
      </div>

      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.name} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{test.name}</h3>
              <button
                onClick={() => runTest(test)}
                disabled={loading[test.name]}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {loading[test.name] ? 'Testing...' : 'Test'}
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {test.method} {test.url}
              </span>
            </div>

            {test.data && (
              <div className="text-sm text-gray-600 mb-2">
                <strong>Data:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
                  {JSON.stringify(test.data, null, 2)}
                </pre>
              </div>
            )}

            {results[test.name] && (
              <div className={`p-3 rounded ${
                results[test.name].success 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-red-100 border-red-300'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={`font-semibold ${
                    results[test.name].success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {results[test.name].success ? '✅ Success' : '❌ Failed'}
                  </span>
                  <span className="ml-2 text-sm">
                    Status: {results[test.name].status}
                  </span>
                </div>
                
                <div className="text-sm">
                  <strong>Message:</strong> {results[test.name].message}
                </div>
                
                {results[test.name].data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">
                      Response Data
                    </summary>
                    <pre className="bg-white p-2 rounded mt-1 text-xs overflow-auto max-h-40">
                      {JSON.stringify(results[test.name].data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Information</h3>
        <div className="text-sm space-y-1">
          <div><strong>Geocoding Endpoint:</strong> {geocodingEndpoints.GEOCODE_ADDRESS_API}</div>
          <div><strong>Station Location Endpoint:</strong> {stationEndpoints.GET_STATION_BY_LOCATION}</div>
          <div><strong>All Stations Endpoint:</strong> {stationEndpoints.GET_ALL_STATION}</div>
        </div>
      </div>
    </div>
  );
};

export default APITester;