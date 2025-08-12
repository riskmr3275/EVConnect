// Google Maps API Loader with proper async handling
class GoogleMapsLoader {
  constructor() {
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
  }

  // Load Google Maps API asynchronously
  load() {
    // Return existing promise if already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Return resolved promise if already loaded
    if (this.isLoaded) {
      return Promise.resolve(window.google);
    }

    // Create new loading promise
    this.loadPromise = new Promise((resolve, reject) => {
      // Check if Google Maps is already available
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        resolve(window.google);
        return;
      }

      this.isLoading = true;

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBUebBA8aQookphpSLu6ha6b0ad7eOPhy4'}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      // Handle successful load
      script.onload = () => {
        this.isLoaded = true;
        this.isLoading = false;
        resolve(window.google);
      };

      // Handle load error
      script.onerror = (error) => {
        this.isLoading = false;
        this.loadPromise = null;
        reject(new Error('Failed to load Google Maps API'));
      };

      // Add script to document
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Check if Google Maps is loaded
  isGoogleMapsLoaded() {
    return this.isLoaded;
  }

  // Get Google Maps instance (only if loaded)
  getGoogleMaps() {
    return this.isLoaded ? window.google : null;
  }
}

// Create singleton instance
const googleMapsLoader = new GoogleMapsLoader();

export default googleMapsLoader;

// Hook for React components
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = React.useState(googleMapsLoader.isGoogleMapsLoaded());
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!isLoaded) {
      googleMapsLoader
        .load()
        .then(() => {
          setIsLoaded(true);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [isLoaded]);

  return {
    isLoaded,
    error,
    googleMaps: googleMapsLoader.getGoogleMaps(),
  };
};