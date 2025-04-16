import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Search, Clock, MapPin, ExternalLink } from 'lucide-react';
import { stationEndpoints } from '../../services/api';

export default function EVChargingStationFinder() {
  const token = useSelector((state) => state.auth.token);
  const { GET_STATION_BY_LOCATION } = stationEndpoints;

  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState([]);
  const [displayedStations, setDisplayedStations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setDisplayedStations([]);
      setHasSearched(false);
    } else {
      const filtered = stations.filter(
        (station) =>
          station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedStations(filtered);
      setHasSearched(true);
    }
  };

  const handleCurrentLocation = () => {
    setLoading(true);
    setErrorMessage('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            GET_STATION_BY_LOCATION,
            {
              latitude,
              longitude,
              radius: 50,
            }
          );

          const fetchedStations = response.data.stations || []; // Make sure this matches your backend structure

          setStations(fetchedStations);
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
    <div className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
      <div className="flex mb-8">
        <div className="relative flex-row gap-5">
          <input
            type="text"
            placeholder="Search by location..."
            className="w-max px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-black text-white ml-2 cursor-pointer px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          Find Stations
        </button>
        <button
          onClick={handleCurrentLocation}
          className="bg-blue-800 text-white cursor-pointer px-4 py-2 ml-2 hover:bg-blue-700 transition-colors"
        >
          Use Current Location
        </button>
      </div>

      {loading && <p className="text-gray-500 mb-4">Loading stations near you...</p>}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      {hasSearched && (
        <p className="mb-4 text-lg font-medium">
          Found {displayedStations.length} station{displayedStations.length !== 1 && 's'} near "{searchQuery || 'your location'}"
        </p>
      )}

      {!hasSearched && displayedStations.length === 0 && (
        <p className="text-gray-500 text-lg italic mb-4">No location chosen yet. Use search or current location to begin.</p>
      )}

      {hasSearched && displayedStations.length === 0 && (
        <p className="text-gray-500 text-lg italic mb-4">No stations found for the selected location.</p>
      )}

      <div className="space-y-4">
        {displayedStations.map((station) => (
          <div key={station.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-1">{station.name}</h2>
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin size={16} className="mr-1" />
              <span>{station.address}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {station.chargerType?.map((type, index) => (
                <span
                  key={index}
                  className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-sm"
                >
                  <span className="w-4 h-4 mr-1 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
                  </span>
                  {type}
                </span>
              ))}
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <Clock size={16} className="mr-1" />
              <span>{station.hours}</span>
            </div>

            <div className="text-gray-600 mb-3">{station.rate}</div>

            <a
              href="#"
              className="inline-flex items-center bg-blue-800 text-white hover:bg-blue-600 p-3 rounded-sm transition-colors"
            >
              <ExternalLink size={16} className="mr-1" />
              Get Direction
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
