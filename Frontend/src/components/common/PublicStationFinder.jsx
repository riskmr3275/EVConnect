import React, { useState } from 'react';
import { Search, MapPin, Navigation, Zap, Star, Clock, Phone, Car, Battery, Loader } from 'lucide-react';
import { apiConnector } from '../../services/apiconnector';
import { stationEndpoints } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PublicStationFinder = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    setLoading(true);
    try {
      // Get all stations and filter by location on frontend
      const response = await apiConnector('GET', stationEndpoints.GET_ALL_STATION);
      
      if (response.data && response.data.data) {
        // Filter stations by location name (simple text search)
        const allStations = response.data.data;
        const filteredStations = allStations.filter(station => 
          station.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
          station.address.toLowerCase().includes(searchLocation.toLowerCase())
        );
        
        setStations(filteredStations);
        if (filteredStations.length === 0) {
          toast.info('No stations found in this location. Try searching nearby areas.');
        }
      } else {
        setStations([]);
        toast.error('Failed to search stations. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setStations([]);
      toast.error('Failed to search stations. Please check your connection.');
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Search for nearby stations using coordinates
            const response = await apiConnector('POST', stationEndpoints.GET_STATION_BY_LOCATION, {
              latitude: latitude,
              longitude: longitude,
              radius: 10 // 10km radius
            });
            
            if (response.data && response.data.data) {
              setStations(response.data.data || []);
              setSearchLocation('Your current location');
              if (response.data.data.length === 0) {
                toast.info('No stations found nearby. Try expanding your search radius.');
              }
            } else {
              setStations([]);
              toast.error('Failed to find nearby stations.');
            }
          } catch (error) {
            console.error('Location search error:', error);
            setStations([]);
            toast.error('Failed to find nearby stations. Please try again.');
          } finally {
            setLoading(false);
            setHasSearched(true);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
          toast.error('Unable to get your location. Please search manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleBookSlot = (stationId) => {
    // Redirect to login page with return URL
    navigate(`/login?redirect=/u/book-slot/${stationId}`);
  };

  const handleGetDirections = (latitude, longitude, stationName) => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(stationName)}`;
      window.open(url, '_blank');
    } else {
      toast.error('Location coordinates not available for this station.');
    }
  };

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Enter your location or destination" 
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSearch}
              disabled={loading || !searchLocation.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find Stations
                </>
              )}
            </button>
            
            <button 
              onClick={handleCurrentLocation}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Navigation className="w-5 h-5" />
              <span className="hidden sm:inline">Current Location</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching for charging stations...</p>
            </div>
          ) : stations.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Found {stations.length} station{stations.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-gray-600">Near "{searchLocation}"</p>
              </div>
              
              <div className="grid gap-6">
                {stations.map((station) => (
                  <div key={station.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Station Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{station.name}</h4>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="text-sm">{station.address}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>24/7 Open</span>
                          </div>
                          {station.contactNumber && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{station.contactNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">
                          {station.rating || '4.5'}
                        </span>
                      </div>
                    </div>

                    {/* Station Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {station.availableSlots || 0}
                        </div>
                        <div className="text-xs text-green-700">Available</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {station.totalSlots || 0}
                        </div>
                        <div className="text-xs text-blue-700">Total Slots</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          ₹{station.pricePerUnit || '8-12'}
                        </div>
                        <div className="text-xs text-purple-700">per kWh</div>
                      </div>
                    </div>

                    {/* Charger Types */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(station.chargingSlots || []).map((slot, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                          <Zap className="w-3 h-3" />
                          <span className="text-sm font-medium">{slot.type}</span>
                        </div>
                      ))}
                      {(!station.chargingSlots || station.chargingSlots.length === 0) && (
                        ['CCS', 'Type-2', 'CHAdeMO'].map((type, index) => (
                          <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                            <Zap className="w-3 h-3" />
                            <span className="text-sm font-medium">{type}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Distance and Status */}
                    {station.distance && (
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Navigation className="w-4 h-4" />
                          <span>{station.distance} km away</span>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          station.availableSlots > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <Battery className="w-3 h-3" />
                          <span>{station.availableSlots > 0 ? 'Available' : 'Full'}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleGetDirections(station.latitude, station.longitude, station.name)}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        Directions
                      </button>
                      <button
                        onClick={() => handleBookSlot(station.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Book Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stations found</h3>
              <p className="text-gray-600 mb-6">Try searching for a different location or expand your search area.</p>
              <button
                onClick={() => {
                  setSearchLocation('');
                  setHasSearched(false);
                  setStations([]);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Search Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Call to Action for Non-logged Users */}
      {!hasSearched && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Find EV Charging Stations</h3>
          <p className="text-gray-600 mb-6">Search for charging stations near you or any location across India.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
            >
              Sign In to Book
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicStationFinder;