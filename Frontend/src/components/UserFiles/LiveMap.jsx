import { useEffect, useRef } from 'react';

export default function LiveMap({ destination }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRenderer = useRef(null);
  const directionsService = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    // Initialize the map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: destination.lat, lng: destination.lng },
    });

    directionsRenderer.current = new window.google.maps.DirectionsRenderer();
    directionsService.current = new window.google.maps.DirectionsService();
    directionsRenderer.current.setMap(mapInstance.current);

    // Start tracking user location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        directionsService.current.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.current.setDirections(result);
            } else {
              console.error('Directions request failed due to ' + status);
            }
          }
        );
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [destination]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '500px', borderRadius: '10px' }}
    ></div>
  );
}
