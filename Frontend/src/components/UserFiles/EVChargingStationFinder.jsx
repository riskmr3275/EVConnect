import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Search, Clock, MapPin, ExternalLink } from 'lucide-react';
import { stationEndpoints } from '../../services/api';
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
      // Optional: You can use this if you want to validate the location
      const response1 = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      // console.log("Geocode response:", response1.data[0]);
      const { lat, lon } = response1.data[0];
      const response = await axios.post(
        GET_STATION_BY_LOCATION,
        {
          latitude: Number(lat),
          longitude: Number(lon),
          radius: 100,
        }
      );
  
      const fetchedStations = response.data.data || [];
      console.log("Stations:", fetchedStations);
  
      setStations(fetchedStations);
      setDisplayedStations(fetchedStations);
      setHasSearched(true);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setErrorMessage('Failed to fetch stations.');
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
              <span>{station.companyName}</span>
            </div>

            <div className="text-gray-600 mb-3">{station.rate}</div>

           <div className='flex flex-row gap-4 py-3'>
           <button
             onClick={() => handleDirection(station.latitude,station.longitude)}
              className="inline-flex items-center bg-blue-800 text-white hover:bg-blue-600 p-3 rounded-sm transition-colors cursor-pointer"
            >
              <ExternalLink size={16} className="mr-1" />
              Get Direction
            </button>
            <div
             className='inline-flex items-center bg-blue-800 text-white hover:bg-blue-600 p-3 rounded-sm transition-colors cursor-pointer font-semibold'>
              <button onClick={() => handleBookSlot(station.id)} className='cursor-pointer'>Check Availability</button></div>
           </div>
          </div>
        ))}
      </div>
    </div>
  );
}
