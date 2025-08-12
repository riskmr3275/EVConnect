import React, { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, Clock, Route, Car, Zap, Phone, AlertCircle, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiConnector } from '../../services/apiconnector';
import { stationEndpoints, geocodingEndpoints } from '../../services/api';
import { toast } from 'react-toastify';

const NavigationMap = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  
  const [station, setStation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    loadGoogleMaps();
    loadStationDetails();
    getCurrentLocation();
  }, [stationId]);

  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,directions`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setLoading(false);
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 25.5941, lng: 85.1376 }, // Default to Patna
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    const directionsServiceInstance = new window.google.maps.DirectionsService();
    const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
      draggable: true,
      panel: document.getElementById('directions-panel'),
    });

    directionsRendererInstance.setMap(mapInstance);

    setMap(mapInstance);
    setDirectionsService(directionsServiceInstance);
    setDirectionsRenderer(directionsRendererInstance);

    // Listen for route changes
    directionsRendererInstance.addListener('directions_changed', () => {
      const directions = directionsRendererInstance.getDirections();
      const route = directions.routes[0];
      if (route) {
        setRouteInfo({
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          steps: route.legs[0].steps,
        });
      }
    });
  };

  const loadStationDetails = async () => {
    try {
      const response = await apiConnector('GET', `${stationEndpoints.GET_STATION_BY_ID_API}/${stationId}`);
      if (response.data.success) {
        setStation(response.data.data);
      } else {
        throw new Error('Station not found');
      }
    } catch (error) {
      console.error('Error loading station:', error);
      setError('Failed to load station details');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your current location');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer || !userLocation || !station) {
      return;
    }

    const destination = {
      lat: station.latitude,
      lng: station.longitude,
    };

    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        } else {
          console.error('Directions request failed:', status);
          toast.error('Failed to calculate route');
        }
      }
    );
  };

  const startNavigation = () => {
    if (!station) return;

    setIsNavigating(true);
    
    // Open in Google Maps app or web
    const destination = `${station.latitude},${station.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    
    window.open(url, '_blank');
    
    toast.success('Navigation started in Google Maps');
  };

  const callStation = () => {
    if (station?.contact) {
      window.location.href = `tel:${station.contact}`;
    } else {
      toast.error('Station contact number not available');
    }
  };

  useEffect(() => {
    if (map && userLocation && station) {
      calculateRoute();
    }
  }, [map, userLocation, station, directionsService, directionsRenderer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Navigation</h3>
          <p className="text-gray-600">Getting your location and route information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Navigation Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Navigation className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {station?.name || 'Navigation'}
              </h1>
              <p className="text-sm text-gray-600">
                {station?.address || 'Loading...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {station?.contact && (
              <button
                onClick={callStation}
                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Floating Action Button */}
          <button
            onClick={startNavigation}
            disabled={!station || isNavigating}
            className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Navigation className="w-6 h-6" />
          </button>
        </div>

        {/* Route Information Panel */}
        <div className="lg:w-80 bg-white border-l border-gray-200 overflow-y-auto">
          {/* Route Summary */}
          {routeInfo && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Route Information</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Route className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-blue-900">{routeInfo.distance}</div>
                  <div className="text-xs text-blue-600">Distance</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-green-900">{routeInfo.duration}</div>
                  <div className="text-xs text-green-600">Duration</div>
                </div>
              </div>

              <button
                onClick={startNavigation}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Start Navigation
              </button>
            </div>
          )}

          {/* Station Details */}
          {station && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Station Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{station.name}</div>
                    <div className="text-sm text-gray-600">{station.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {station.availableSlots}/{station.totalSlots} slots available
                    </div>
                  </div>
                </div>

                {station.contact && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{station.contact}</div>
                      <button
                        onClick={callStation}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Call Station
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Turn-by-turn Directions */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Directions</h3>
            <div id="directions-panel" className="text-sm text-gray-600">
              {!routeInfo && (
                <div className="text-center py-8 text-gray-500">
                  <Route className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Calculating route...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationMap;