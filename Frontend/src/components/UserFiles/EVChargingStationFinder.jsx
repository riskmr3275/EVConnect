import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Search, Clock, MapPin, ExternalLink, Navigation, Zap, Star, Filter, Loader, AlertCircle } from 'lucide-react';
import { stationEndpoints, geocodingEndpoints } from '../../services/api';
import { apiConnector } from '../../services/apiconnector';
import { useNavigate } from 'react-router-dom';

export default function EVChargingStationFinder() {
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const { GET_STATION_BY_LOCATION } = stationEndpoints;

  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState([]);
  const [displayedStations, setDisplayedStations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBookSlot = (stationId) => {
    navigate(`/u/book-slot/${stationId}`); // using URL param
  };
  
  const handleDirection = (latitude,longitude) => {
    navigate(`/u/get-direction?lat=${latitude}&lng=${longitude}`);
  };
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setDisplayedStations([]);
      setHasSearched(false);
      return;
    }
  
    setLoading(true);
    setErrorMessage('');
  
    try {
      // Use backend geocoding API instead of direct OpenStreetMap call
      const geocodeResponse = await apiConnector(
        'GET',
        geocodingEndpoints.GEOCODE_ADDRESS_API,
        null,
        {},
        { address: searchQuery }
      );
      
      if (!geocodeResponse.data.success || !geocodeResponse.data.data) {
        throw new Error('Location not found');
      }

      const { latitude, longitude } = geocodeResponse.data.data;
      console.log("Geocoded coordinates:", { latitude, longitude });

      // Now search for stations near this location
      const stationsResponse = await apiConnector(
        'POST',
        GET_STATION_BY_LOCATION,
        {
          latitude: Number(latitude),
          longitude: Number(longitude),
          radius: 100,
        }
      );
  
      const fetchedStations = stationsResponse.data.data || [];
      console.log("Stations:", fetchedStations);
  
      setStations(fetchedStations);
      setDisplayedStations(fetchedStations);
      setHasSearched(true);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setErrorMessage(err.message || 'Failed to fetch stations.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleCurrentLocation = () => {
    setLoading(true);
    setErrorMessage('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          console.log(`Fetching stations near lat: ${latitude}, long: ${longitude}`);
          const response = await axios.post(
            GET_STATION_BY_LOCATION,
            {
              latitude: latitude,
              longitude: longitude,
              radius: 100,
            }
          );

          const fetchedStations = response.data.data || []; // Make sure this matches your backend structure
          console.log(fetchedStations)
          setStations(fetchedStations);
          setSearchQuery("")
          setDisplayedStations(fetchedStations);
          setHasSearched(true);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching stations:', err);
          setErrorMessage('Failed to fetch stations from your location.');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setErrorMessage('Could not access your location.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Find Charging Stations</h1>
        
        {/* Search Section */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find Stations
                </>
              )}
            </button>
            
            <button
              onClick={handleCurrentLocation}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">Current Location</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Finding stations near you...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Results Header */}
        {hasSearched && !loading && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {displayedStations.length > 0 
                ? `Found ${displayedStations.length} station${displayedStations.length !== 1 ? 's' : ''}`
                : 'No stations found'
              }
            </h2>
            {searchQuery && (
              <p className="text-gray-600">Near "{searchQuery}"</p>
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && displayedStations.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Find Charging Stations</h3>
            <p className="text-gray-600 mb-6">Search by location or use your current location to find nearby EV charging stations.</p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && displayedStations.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Stations Found</h3>
            <p className="text-gray-600">Try searching for a different location or expand your search area.</p>
          </div>
        )}

        {/* Station Cards */}
        <div className="space-y-4">
          {displayedStations.map((station) => (
            <div key={station.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Station Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{station.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm">{station.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-yellow-700">4.5</span>
                </div>
              </div>

              {/* Company Info */}
              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{station.companyName}</span>
              </div>

              {/* Charger Types */}
              <div className="flex flex-wrap gap-2 mb-4">
                {station.chargerType?.map((type, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>

              {/* Rate */}
              {station.rate && (
                <div className="text-gray-600 mb-4 text-sm">{station.rate}</div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDirection(station.latitude, station.longitude)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </button>
                <button
                  onClick={() => handleBookSlot(station.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
