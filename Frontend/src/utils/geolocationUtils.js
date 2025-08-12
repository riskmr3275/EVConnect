import { geocodingEndpoints } from '../services/api';
import { apiConnector } from '../services/apiconnector';

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Geocode address using backend API
export const geocodeAddress = async (address) => {
  try {
    const response = await apiConnector(
      'GET',
      geocodingEndpoints.GEOCODE_ADDRESS_API,
      null,
      {},
      { address }
    );
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to geocode address');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Unable to find location');
  }
};

// Reverse geocode coordinates using backend API
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await apiConnector(
      'GET',
      geocodingEndpoints.REVERSE_GEOCODE_API,
      null,
      {},
      { latitude, longitude }
    );
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to reverse geocode coordinates');
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Unable to get address for location');
  }
};

// Calculate distance between two points
export const calculateDistance = async (lat1, lon1, lat2, lon2) => {
  try {
    const response = await apiConnector(
      'GET',
      geocodingEndpoints.CALCULATE_DISTANCE_API,
      null,
      {},
      { lat1, lon1, lat2, lon2 }
    );
    
    if (response.data.success) {
      return response.data.data.distance;
    } else {
      throw new Error('Failed to calculate distance');
    }
  } catch (error) {
    console.error('Distance calculation error:', error);
    throw new Error('Unable to calculate distance');
  }
};

// Get nearby places
export const getNearbyPlaces = async (latitude, longitude, radius = 1000) => {
  try {
    const response = await apiConnector(
      'GET',
      geocodingEndpoints.GET_NEARBY_PLACES_API,
      null,
      {},
      { latitude, longitude, radius }
    );
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to get nearby places');
    }
  } catch (error) {
    console.error('Nearby places error:', error);
    throw new Error('Unable to get nearby places');
  }
};

// Format coordinates for display
export const formatCoordinates = (latitude, longitude, precision = 6) => {
  return {
    latitude: parseFloat(latitude).toFixed(precision),
    longitude: parseFloat(longitude).toFixed(precision),
    display: `${parseFloat(latitude).toFixed(precision)}, ${parseFloat(longitude).toFixed(precision)}`
  };
};

// Validate coordinates
export const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
};

// Convert address to a search-friendly format
export const formatAddressForSearch = (address) => {
  return address
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s,-]/g, '') // Remove special characters except commas and hyphens
    .toLowerCase();
};

// Get location permission status
export const getLocationPermissionStatus = async () => {
  if (!navigator.permissions) {
    return 'unsupported';
  }
  
  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state; // 'granted', 'denied', or 'prompt'
  } catch (error) {
    return 'unsupported';
  }
};

export default {
  getCurrentLocation,
  geocodeAddress,
  reverseGeocode,
  calculateDistance,
  getNearbyPlaces,
  formatCoordinates,
  isValidCoordinates,
  formatAddressForSearch,
  getLocationPermissionStatus,
};