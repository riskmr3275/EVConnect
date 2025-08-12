// System health check utility
export const performSystemCheck = () => {
  const checks = {
    environment: checkEnvironmentVariables(),
    apis: checkAPIEndpoints(),
    storage: checkLocalStorage(),
    dependencies: checkDependencies(),
  };

  console.log('🔍 System Health Check Results:', checks);
  return checks;
};

// Check environment variables
const checkEnvironmentVariables = () => {
  const requiredEnvVars = [
    'VITE_API_URL',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_SOCKET_URL',
  ];

  const results = {};
  requiredEnvVars.forEach(envVar => {
    results[envVar] = {
      exists: !!import.meta.env[envVar],
      value: import.meta.env[envVar] ? '✅ Set' : '❌ Missing',
    };
  });

  return results;
};

// Check API endpoints availability
const checkAPIEndpoints = () => {
  try {
    const { 
      authEndpoints, 
      evEndpoints, 
      stationEndpoints, 
      stationMasterEndpoints,
      reviewEndpoints,
      transactionEndpoints,
      notificationEndpoints 
    } = require('../services/api');

    return {
      authEndpoints: authEndpoints ? '✅ Available' : '❌ Missing',
      evEndpoints: evEndpoints ? '✅ Available' : '❌ Missing',
      stationEndpoints: stationEndpoints ? '✅ Available' : '❌ Missing',
      stationMasterEndpoints: stationMasterEndpoints ? '✅ Available' : '❌ Missing',
      reviewEndpoints: reviewEndpoints ? '✅ Available' : '❌ Missing',
      transactionEndpoints: transactionEndpoints ? '✅ Available' : '❌ Missing',
      notificationEndpoints: notificationEndpoints ? '✅ Available' : '❌ Missing',
    };
  } catch (error) {
    return { error: '❌ Failed to load API endpoints' };
  }
};

// Check local storage functionality
const checkLocalStorage = () => {
  try {
    const testKey = '__test__';
    const testValue = 'test';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    return retrieved === testValue ? '✅ Working' : '❌ Not working';
  } catch (error) {
    return '❌ Not available';
  }
};

// Check critical dependencies
const checkDependencies = () => {
  const dependencies = {
    React: typeof React !== 'undefined' ? '✅ Available' : '❌ Missing',
    ReactDOM: typeof ReactDOM !== 'undefined' ? '✅ Available' : '❌ Missing',
    axios: typeof window.axios !== 'undefined' ? '✅ Available' : '❌ Missing',
    socketIO: typeof window.io !== 'undefined' ? '✅ Available' : '❌ Missing',
  };

  return dependencies;
};

// Performance monitoring
export const monitorPerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      pageLoadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    };
  }
  
  return { error: 'Performance API not available' };
};

// Network connectivity check
export const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok ? '✅ Connected' : '❌ Server unreachable';
  } catch (error) {
    return '❌ Network error';
  }
};

// Export all checks
export default {
  performSystemCheck,
  monitorPerformance,
  checkNetworkConnectivity,
};