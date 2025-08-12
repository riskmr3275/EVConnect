import { useState, useEffect } from 'react';
import { getCurrentLocation, getLocationPermissionStatus } from '../utils/geolocationUtils';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000,
    watch = false,
  } = options;

  // Get current location
  const getLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentLocation();
      setLocation(position);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check permission status
  const checkPermission = async () => {
    const status = await getLocationPermissionStatus();
    setPermissionStatus(status);
  };

  // Watch position changes
  useEffect(() => {
    let watchId = null;

    if (watch && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setError(null);
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch, enableHighAccuracy, timeout, maximumAge]);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  return {
    location,
    error,
    loading,
    permissionStatus,
    getLocation,
    checkPermission,
    isSupported: !!navigator.geolocation,
  };
};

export default useGeolocation;