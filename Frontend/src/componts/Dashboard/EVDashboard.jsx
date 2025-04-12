import React, { useState, useEffect } from 'react';
import { Bell, LogOut, MapPin, User, Moon, Sun, Calendar, Battery, Home, Settings, Car, Star, Clock, ChevronDown, X, Filter, Check } from 'lucide-react';

export default function EVDashboard() {
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [location, setLocation] = useState('');
  const [useGPS, setUseGPS] = useState(false);
  const [evFormData, setEvFormData] = useState({
    brand: '',
    model: '',
    batteryCapacity: '',
    chargingPort: '',
    chargingSpeed: ''
  });
  const [stations, setStations] = useState([]);
  const [filters, setFilters] = useState({
    distance: 10,
    chargingSpeed: 'all',
    connectorType: 'all',
    availability: true
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    profilePic: "/api/placeholder/40/40",
    totalBookings: 28,
    upcomingBookings: 2,
    completedSessions: 24,
    cancelledSessions: 2
  };

  // Mock charging stations
  useEffect(() => {
    // Simulating API call to fetch stations
    const mockStations = [
      {
        id: 1,
        name: "EcoCharge Central",
        address: "123 Energy Blvd, Downtown",
        connectors: ["Type-2", "CCS"],
        distance: 1.2,
        availableSlots: 3,
        totalSlots: 8,
        rating: 4.8
      },
      {
        id: 2,
        name: "GreenPower Station",
        address: "456 Volt Avenue, Midtown",
        connectors: ["Type-2", "CHAdeMO"],
        distance: 3.5,
        availableSlots: 0,
        totalSlots: 4,
        rating: 4.2
      },
      {
        id: 3,
        name: "ElectriDrive Hub",
        address: "789 Charging Lane, Uptown",
        connectors: ["CCS", "Type-2", "CHAdeMO"],
        distance: 0.8,
        availableSlots: 5,
        totalSlots: 12,
        rating: 4.9
      }
    ];
    setStations(mockStations);
  }, [location, useGPS]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle EV form data change
  const handleEvFormChange = (e) => {
    const { name, value } = e.target;
    setEvFormData({
      ...evFormData,
      [name]: value
    });
  };

  // Handle form submission
  const handleEvFormSubmit = (e) => {
    e.preventDefault();
    // Process form data
    console.log("EV Data submitted:", evFormData);
    // Clear form
    setEvFormData({
      brand: '',
      model: '',
      batteryCapacity: '',
      chargingPort: '',
      chargingSpeed: ''
    });
    // Show success message
    alert("Vehicle details added successfully!");
  };

  // Handle location input
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Use GPS to detect location
  const handleUseGPS = () => {
    setUseGPS(true);
    // Simulate fetching location
    setTimeout(() => {
      setLocation("Current Location: Downtown Area");
      setUseGPS(false);
    }, 1000);
  };

  // Filter stations
  const filteredStations = stations.filter(station => {
    if (filters.availability && station.availableSlots === 0) return false;
    if (filters.distance < 10 && station.distance > filters.distance) return false;
    if (filters.connectorType !== 'all' && !station.connectors.includes(filters.connectorType)) return false;
    return true;
  });

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const mainContentClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50';
  const cardClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const headingClass = darkMode ? 'text-white' : 'text-gray-800';
  const sidebarClass = darkMode ? 'bg-gray-800' : 'bg-black';
   const highlightClass = darkMode ? 'bg-indigo-700' : 'bg-indigo-500';
  const buttonClass = darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-600';

  return (
    <div className={`flex h-screen ${mainContentClass}`}>
      {/* Left Sidebar */}
      <div className={`${sidebarClass} w-80 flex-shrink-0 hidden md:block h-full`}>
        <div className="p-4">
           
          <nav>
            <ul className="space-y-2 p-2  rounded-2xl h-full">
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center w-full py-2 px-4 rounded-lg ${activeTab === 'dashboard' ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-500 hover:cursor-pointer'}`}
                >
                  <Home className="mr-3" size={18} />
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('mybookings')}
                  className={`flex items-center w-full py-2 px-4 rounded-lg ${activeTab === 'mybookings' ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-500 hover:cursor-pointer'}`}
                >
                  <Calendar className="mr-3" size={18} />
                  My Bookings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('availableslots')}
                  className={`flex items-center w-full py-2 px-4 rounded-lg ${activeTab === 'availableslots' ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-500 hover:cursor-pointer'}`}
                >
                  <Settings className="mr-3" size={18} />
                  Available Slots
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('addev')}
                  className={`flex items-center w-full py-2 px-4 rounded-lg ${activeTab === 'addev' ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-500 hover:cursor-pointer'}`}
                >
                  <Car className="mr-3" size={18} />
                  Add Your EV
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center w-full py-2 px-4 rounded-lg ${activeTab === 'settings' ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-500 hover:cursor-pointer'}`}
                >
                  <Settings className="mr-3" size={18} />
                  Settings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => console.log('Logout clicked')}
                  className={`flex items-center w-full py-2 px-4 rounded-lg text-red-600 hover:cursor-pointer`}
                >
                  <LogOut className="mr-3" size={18} />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className={`${sidebarClass} w-16 flex-shrink-0 md:hidden flex flex-col items-center py-4`}>
        <div className="space-y-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`p-3 rounded-full ${activeTab === 'dashboard' ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`}
          >
            <Home color="white" size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('mybookings')}
            className={`p-3 rounded-full ${activeTab === 'mybookings' ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`}
          >
            <Calendar color="white" size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('availableslots')}
            className={`p-3 rounded-full ${activeTab === 'availableslots' ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`}
          >
            <Calendar color="white" size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('addev')}
            className={`p-3 rounded-full ${activeTab === 'addev' ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`}
          >
            <Car color="white" size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-3 rounded-full ${activeTab === 'settings' ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`}
          >
            <Settings color="white" size={20} />
          </button>
          <button 
            onClick={() => console.log('Logout clicked')}
            className="p-3 rounded-full hover:bg-indigo-600"
          >
            <LogOut color="white" size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
          <div className="container mx-auto">
            {activeTab === 'dashboard' && (
              <>
                 
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${textClass}`}>Total Bookings</p>
                        <p className={`text-2xl font-semibold ${headingClass}`}>{user.totalBookings}</p>
                      </div>
                      <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                        <Calendar className={highlightClass} size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${textClass}`}>Upcoming Bookings</p>
                        <p className={`text-2xl font-semibold ${headingClass}`}>{user.upcomingBookings}</p>
                      </div>
                      <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                        <Clock className={highlightClass} size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${textClass}`}>Completed Sessions</p>
                        <p className={`text-2xl font-semibold ${headingClass}`}>{user.completedSessions}</p>
                      </div>
                      <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                        <Check className={highlightClass} size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm ${textClass}`}>Cancelled Sessions</p>
                        <p className={`text-2xl font-semibold ${headingClass}`}>{user.cancelledSessions}</p>
                      </div>
                      <div className={`rounded-full p-2 ${highlightClass} bg-opacity-10`}>
                        <X className={highlightClass} size={20} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass} mb-8`}>
                  <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>Personalized Recommendations</h3>
                  <div className="space-y-4">
                    <div className={`flex items-center p-3 rounded-lg bg-indigo-50 ${darkMode ? 'bg-indigo-900 bg-opacity-30' : ''}`}>
                      <Star className="text-indigo-500 mr-3" size={20} />
                      <div>
                        <p className={`font-medium ${headingClass}`}>Most visited station: EcoCharge Central</p>
                        <p className={`text-sm ${textClass}`}>You charged here 8 times in the last month</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center p-3 rounded-lg bg-indigo-50 ${darkMode ? 'bg-indigo-900 bg-opacity-30' : ''}`}>
                      <Clock className="text-indigo-500 mr-3" size={20} />
                      <div>
                        <p className={`font-medium ${headingClass}`}>You usually charge at 7 PM – want to book in advance?</p>
                        <button className={`mt-2 text-sm ${buttonClass} text-white px-3 py-1 rounded-md`}>Book Now</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Details */}
                <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>Additional Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className={`text-sm font-medium mb-1 ${textClass}`}>Frequent Travel Routes</label>
                      <select className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}>
                        <option>Home ↔ Office (12km)</option>
                        <option>Home ↔ Shopping Mall (5km)</option>
                        <option>Office ↔ Gym (3km)</option>
                        <option>+ Add new route</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col">
                      <label className={`text-sm font-medium mb-1 ${textClass}`}>Favorite Stations</label>
                      <div className="flex flex-wrap gap-2">
                        <span className={`py-1 px-3 rounded-full text-sm ${borderClass} border inline-flex items-center`}>
                          EcoCharge Central
                          <button className="ml-2"><X size={14} /></button>
                        </span>
                        <span className={`py-1 px-3 rounded-full text-sm ${borderClass} border inline-flex items-center`}>
                          ElectriDrive Hub
                          <button className="ml-2"><X size={14} /></button>
                        </span>
                        <button className={`py-1 px-3 rounded-full text-sm ${highlightClass} text-white`}>+ Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'addev' && (
              <>
                <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Add Your EV</h2>
                <div className={`${cardClass} rounded-lg shadow-sm p-6 border ${borderClass}`}>
                  <form onSubmit={handleEvFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <label className={`text-sm font-medium mb-1 ${textClass}`}>EV Brand</label>
                        <select 
                          name="brand"
                          value={evFormData.brand}
                          onChange={handleEvFormChange}
                          className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                          required
                        >
                          <option value="">Select Brand</option>
                          <option value="tesla">Tesla</option>
                          <option value="nissan">Nissan</option>
                          <option value="chevrolet">Chevrolet</option>
                          <option value="ford">Ford</option>
                          <option value="hyundai">Hyundai</option>
                          <option value="kia">Kia</option>
                          <option value="audi">Audi</option>
                          <option value="volkswagen">Volkswagen</option>
                          <option value="bmw">BMW</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col">
                        <label className={`text-sm font-medium mb-1 ${textClass}`}>EV Model</label>
                        <input 
                          type="text"
                          name="model"
                          value={evFormData.model}
                          onChange={handleEvFormChange}
                          placeholder="e.g. Model 3, Leaf, Bolt"
                          className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <label className={`text-sm font-medium mb-1 ${textClass}`}>Battery Capacity (kWh)</label>
                        <input 
                          type="number"
                          name="batteryCapacity"
                          value={evFormData.batteryCapacity}
                          onChange={handleEvFormChange}
                          placeholder="e.g. 75"
                          className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <label className={`text-sm font-medium mb-1 ${textClass}`}>Charging Port Type</label>
                        <select 
                          name="chargingPort"
                          value={evFormData.chargingPort}
                          onChange={handleEvFormChange}
                          className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                          required
                        >
                          <option value="">Select Port Type</option>
                          <option value="Type-2">Type-2</option>
                          <option value="CCS">CCS</option>
                          <option value="CHAdeMO">CHAdeMO</option>
                          <option value="Tesla">Tesla Connector</option>
                          <option value="Type-1">Type-1 (J1772)</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col">
                        <label className={`text-sm font-medium mb-1 ${textClass}`}>Preferred Charging Speed</label>
                        <select 
                          name="chargingSpeed"
                          value={evFormData.chargingSpeed}
                          onChange={handleEvFormChange}
                          className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                          required
                        >
                          <option value="">Select Charging Speed</option>
                          <option value="slow">Slow (AC, up to 7.4 kW)</option>
                          <option value="fast">Fast (AC, 7.4-22 kW)</option>
                          <option value="rapid">Rapid (DC, 50+ kW)</option>
                          <option value="ultra">Ultra Rapid (DC, 100+ kW)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button 
                        type="submit"
                        className={`${buttonClass} text-white px-6 py-2 rounded-lg font-medium`}
                      >
                        Save Vehicle Details
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeTab === 'availableslots' && (
              <>
                <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Available Charging Slots</h2>
                
                {/* Location search */}
                <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass} mb-6`}>
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <label className={`text-sm font-medium mb-1 block ${textClass}`}>Your Location</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={location}
                          onChange={handleLocationChange}
                          placeholder="Enter your location"
                          className={`w-full py-2 pl-10 pr-3 rounded-lg border ${borderClass} bg-transparent`}
                        />
                        <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      </div>
                    </div>
                    <button
                      onClick={handleUseGPS}
                      disabled={useGPS}
                      className={`${buttonClass} text-white px-4 py-2 rounded-lg font-medium flex items-center ${useGPS ? 'opacity-70' : ''}`}
                    >
                      {useGPS ? 'Detecting...' : 'Use GPS'}
                    </button>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center border ${borderClass}`}
                    >
                      <Filter size={18} className="mr-2" />
                      Filters
                      <ChevronDown size={18} className="ml-2" />
                    </button>
                  </div>
                  
                  {/* Filters panel */}
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className={`text-sm font-medium mb-1 block ${textClass}`}>Max Distance</label>
                        <select
                          value={filters.distance}
                          onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                          className={`w-full py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                        >
                          <option value={5}>Within 5 km</option>
                          <option value={10}>Within 10 km</option>
                          <option value={20}>Within 20 km</option>
                          <option value={50}>Within 50 km</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`text-sm font-medium mb-1 block ${textClass}`}>Charging Speed</label>
                        <select
                          value={filters.chargingSpeed}
                          onChange={(e) => handleFilterChange('chargingSpeed', e.target.value)}
                          className={`w-full py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                        >
                          <option value="all">All Speeds</option>
                          <option value="slow">Slow</option>
                          <option value="fast">Fast</option>
                          <option value="rapid">Rapid</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`text-sm font-medium mb-1 block ${textClass}`}>Connector Type</label>
                        <select
                          value={filters.connectorType}
                          onChange={(e) => handleFilterChange('connectorType', e.target.value)}
                          className={`w-full py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}
                        >
                          <option value="all">All Types</option>
                          <option value="Type-2">Type-2</option>
                          <option value="CCS">CCS</option>
                          <option value="CHAdeMO">CHAdeMO</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`text-sm font-medium mb-1 block ${textClass}`}>Availability</label>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id="availabilityFilter"
                            checked={filters.availability}
                            onChange={(e) => handleFilterChange('availability', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="availabilityFilter" className={`${textClass}`}>Show only available stations</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Stations list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStations.map((station) => (
                    <div key={station.id} className={`${cardClass} rounded-lg shadow-sm border ${borderClass} overflow-hidden`}>
                      <div className={`p-4 ${station.availableSlots === 0 ? 'opacity-60' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className={`font-semibold ${headingClass}`}>{station.name}</h3>
                          <div className={`text-sm rounded-full px-2 py-0.5 ${station.availableSlots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} ${darkMode ? 'bg-opacity-20' : ''}`}>
                            {station.availableSlots > 0 ? `${station.availableSlots} available` : 'No slots available'}
                          </div>
                        </div>
                        
                        <p className={`text-sm ${textClass} mb-3`}>{station.address}</p>
                        
                        <div className="flex items-center text-sm mb-3">
                          <MapPin size={16} className="mr-1 text-gray-400" />
                          <span className={textClass}>{station.distance} km away</span>
                          <div className="mx-2 text-gray-300">•</div>
                          <Star size={16} className="mr-1 text-yellow-400" />
                          <span className={textClass}>{station.rating}</span>
                        </div>
                        
                        <div className="mb-4">
                          <p className={`text-sm font-medium mb-1 ${textClass}`}>Connectors:</p>
                          <div className="flex flex-wrap gap-2">
                            {station.connectors.map((connector, idx) => (
                                <span 
                                key={idx} 
                                className={`text-xs px-2 py-1 rounded-full bg-indigo-100 ${darkMode ? 'bg-indigo-900 bg-opacity-50 text-indigo-300' : 'text-indigo-800'}`}
                              >
                                {connector}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <button 
                            className={`${station.availableSlots > 0 ? buttonClass : 'bg-gray-300 hover:bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded-lg text-sm font-medium`}
                            disabled={station.availableSlots === 0}
                          >
                            {station.availableSlots > 0 ? 'Book Slot' : 'Fully Booked'}
                          </button>
                          
                          <button 
                            className={`border ${borderClass} px-4 py-2 rounded-lg text-sm font-medium`}
                            onClick={() => console.log(`Get directions to ${station.name}`)}
                          >
                            Get Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredStations.length === 0 && (
                  <div className={`${cardClass} rounded-lg shadow-sm p-8 border ${borderClass} text-center`}>
                    <p className={`text-lg font-medium ${headingClass}`}>No charging stations found matching your filters</p>
                    <p className={`${textClass} mt-2`}>Try adjusting your filters or changing your location</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'mybookings' && (
              <>
                <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>My Bookings</h2>
                
                <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass} mb-6`}>
                  <h3 className={`font-semibold ${headingClass} mb-4`}>Upcoming Bookings</h3>
                  
                  <div className={`border-l-4 border-indigo-500 pl-4 py-2 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-r-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>EcoCharge Central</h4>
                        <p className={`text-sm ${textClass}`}>Today, 7:00 PM - 8:00 PM</p>
                        <p className={`text-sm ${textClass}`}>Connector: Type-2</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className={`text-sm px-3 py-1 rounded-lg border ${borderClass}`}>
                          Reschedule
                        </button>
                        <button className="text-sm px-3 py-1 rounded-lg bg-red-100 text-red-600">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-l-4 border-indigo-500 pl-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-r-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>ElectriDrive Hub</h4>
                        <p className={`text-sm ${textClass}`}>Tomorrow, 2:00 PM - 3:30 PM</p>
                        <p className={`text-sm ${textClass}`}>Connector: CCS</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className={`text-sm px-3 py-1 rounded-lg border ${borderClass}`}>
                          Reschedule
                        </button>
                        <button className="text-sm px-3 py-1 rounded-lg bg-red-100 text-red-600">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`${cardClass} rounded-lg shadow-sm p-4 border ${borderClass}`}>
                  <h3 className={`font-semibold ${headingClass} mb-4`}>Past Bookings</h3>
                  
                  <div className={`border-l-4 border-gray-300 pl-4 py-2 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-r-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>GreenPower Station</h4>
                        <p className={`text-sm ${textClass}`}>April 10, 2025, 10:00 AM - 11:30 AM</p>
                        <p className={`text-sm ${textClass}`}>Connector: CHAdeMO • 32.5 kWh charged</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className={`text-sm px-3 py-1 rounded-lg bg-indigo-100 ${darkMode ? 'bg-indigo-900 bg-opacity-30 text-indigo-300' : 'text-indigo-600'}`}>
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-l-4 border-gray-300 pl-4 py-2 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-r-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>EcoCharge Central</h4>
                        <p className={`text-sm ${textClass}`}>April 7, 2025, 6:30 PM - 8:00 PM</p>
                        <p className={`text-sm ${textClass}`}>Connector: Type-2 • 45.2 kWh charged</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className={`text-sm px-3 py-1 rounded-lg bg-indigo-100 ${darkMode ? 'bg-indigo-900 bg-opacity-30 text-indigo-300' : 'text-indigo-600'}`}>
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-l-4 border-red-500 pl-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-r-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>ElectriDrive Hub</h4>
                        <p className={`text-sm ${textClass}`}>April 5, 2025, 2:00 PM - 3:30 PM</p>
                        <p className={`text-sm text-red-500`}>Cancelled</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className={`text-sm px-3 py-1 rounded-lg bg-indigo-100 ${darkMode ? 'bg-indigo-900 bg-opacity-30 text-indigo-300' : 'text-indigo-600'}`}>
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button className={`text-sm px-4 py-2 ${buttonClass} text-white rounded-lg`}>
                      View All Bookings
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Settings</h2>
                
                <div className={`${cardClass} rounded-lg shadow-sm p-6 border ${borderClass} mb-6`}>
                  <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-2 md:mb-0">
                        <h4 className={`font-medium ${headingClass}`}>Profile Information</h4>
                        <p className={`text-sm ${textClass}`}>Update your account details</p>
                      </div>
                      <button className={`text-sm px-4 py-2 ${buttonClass} text-white rounded-lg`}>
                        Edit Profile
                      </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-2 md:mb-0">
                        <h4 className={`font-medium ${headingClass}`}>Password</h4>
                        <p className={`text-sm ${textClass}`}>Change your password</p>
                      </div>
                      <button className={`text-sm px-4 py-2 border ${borderClass} rounded-lg`}>
                        Change Password
                      </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-2 md:mb-0">
                        <h4 className={`font-medium ${headingClass}`}>Two-Factor Authentication</h4>
                        <p className={`text-sm ${textClass}`}>Secure your account with 2FA</p>
                      </div>
                      <button className={`text-sm px-4 py-2 border ${borderClass} rounded-lg`}>
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className={`${cardClass} rounded-lg shadow-sm p-6 border ${borderClass} mb-6`}>
                  <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>Email Notifications</h4>
                        <p className={`text-sm ${textClass}`}>Receive booking confirmations and reminders</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input type="checkbox" id="emailToggle" className="sr-only" defaultChecked />
                        <div className="block h-6 bg-gray-300 rounded-full w-12"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>Push Notifications</h4>
                        <p className={`text-sm ${textClass}`}>Get alerts on your device</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input type="checkbox" id="pushToggle" className="sr-only" defaultChecked />
                        <div className="block h-6 bg-gray-300 rounded-full w-12"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>SMS Notifications</h4>
                        <p className={`text-sm ${textClass}`}>Receive text messages for important updates</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input type="checkbox" id="smsToggle" className="sr-only" />
                        <div className="block h-6 bg-gray-300 rounded-full w-12"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`${cardClass} rounded-lg shadow-sm p-6 border ${borderClass} mb-6`}>
                  <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>App Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>Dark Mode</h4>
                        <p className={`text-sm ${textClass}`}>Toggle between light and dark themes</p>
                      </div>
                      <div className="relative inline-block w-12 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="darkModeToggle" 
                          className="sr-only" 
                          checked={darkMode}
                          onChange={toggleDarkMode}
                        />
                        <div className="block h-6 bg-gray-300 rounded-full w-12"></div>
                        <div className={`dot absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>Language</h4>
                        <p className={`text-sm ${textClass}`}>Choose your preferred language</p>
                      </div>
                      <select className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}>
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Chinese</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${headingClass}`}>Distance Unit</h4>
                        <p className={`text-sm ${textClass}`}>Choose between kilometers and miles</p>
                      </div>
                      <select className={`py-2 px-3 rounded-lg border ${borderClass} bg-transparent`}>
                        <option>Kilometers (km)</option>
                        <option>Miles (mi)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className={`${cardClass} rounded-lg shadow-sm p-6 border ${borderClass}`}>
                  <h3 className={`text-lg font-semibold mb-4 text-red-500`}>Danger Zone</h3>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-2 md:mb-0">
                        <h4 className={`font-medium ${headingClass}`}>Delete Account</h4>
                        <p className={`text-sm ${textClass}`}>Permanently delete your account and all data</p>
                      </div>
                      <button className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}