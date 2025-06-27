import { useEffect, useRef } from 'react';

export default function LiveMap({ destination }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsRenderer = useRef(null);
  const directionsService = useRef(null);
  const destinationMarker = useRef(null);

  useEffect(() => {
    if (!window.google || !destination?.lat || !destination?.lng) {
      console.error("Google Maps API or destination not loaded properly.");
      return;
    }

    // Initialize the map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: destination.lat, lng: destination.lng },
    });

    // Add a marker at the destination
    destinationMarker.current = new window.google.maps.Marker({
      position: destination,
      map: mapInstance.current,
      title: "EV Station",
    });

    directionsRenderer.current = new window.google.maps.DirectionsRenderer({ suppressMarkers: false });
    directionsService.current = new window.google.maps.DirectionsService();
    directionsRenderer.current.setMap(mapInstance.current);

    // Track user location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Re-center the map on the user's current location
        mapInstance.current.setCenter(origin);

        directionsService.current.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.current.setDirections(result);

              // Optional: log ETA and distance
              const leg = result.routes[0]?.legs[0];
              if (leg) {
                console.log(`ETA: ${leg.duration.text}, Distance: ${leg.distance.text}`);
              }
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

    // Cleanup on component unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, [destination]);

  return (
    <div
      ref={mapRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        width: '80vw',
        height: '80vh',
      }}
    />
  );
}
