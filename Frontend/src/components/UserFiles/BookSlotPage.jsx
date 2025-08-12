import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Zap, Car, Filter, Heart, QrCode, AlertCircle, CheckCircle, X, Phone, Wifi, Coffee, Shield, CreditCard, ArrowLeft, Navigation, Battery, Timer, Loader } from 'lucide-react';
import { apiConnector } from '../../services/apiconnector';
import { stationEndpoints, bookingEndpoints } from '../../services/api';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rtb4nAMChRfzUlUnzrwrUxFy7Mh7DDCR22eo52qiFbziYXI2V5DOW4LiKj8aQJR1GAe35vnHXS3DAR1yKcGfwVQ002kJnd72K');
const BookSlotPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('stations'); // stations, booking, confirmation, waitlist
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(20);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    portType: 'all',
    fastChargers: false,
    openNow: false,
    sortBy: 'distance'
  });
  const [bookingData, setBookingData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Mock data for stations
  const station = [
    {
      id: 1,
      name: "PowerHub Central Mall",
      location: "Central Mall, Sector 12, Patna",
      distance: "2.3 km",
      rating: 4.8,
      reviews: 156,
      manager: "Rajesh Kumar",
      phone: "+91 98765 43210",
      facilities: ["WiFi", "Cafe", "Restroom", "Security", "Parking"],
      totalPorts: 12,
      availablePorts: 7,
      pricePerUnit: 8.5,
      image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=200&fit=crop",
      ports: [
        { id: 'P1', type: 'CCS', power: '50kW', status: 'available', rate: 8.5 },
        { id: 'P2', type: 'CHAdeMO', power: '50kW', status: 'occupied', rate: 8.5 },
        { id: 'P3', type: 'Type2', power: '22kW', status: 'available', rate: 6.0 },
        { id: 'P4', type: 'CCS', power: '150kW', status: 'available', rate: 12.0 },
        { id: 'P5', type: 'Type2', power: '11kW', status: 'maintenance', rate: 5.5 },
        { id: 'P6', type: 'CCS', power: '50kW', status: 'occupied', rate: 8.5 },
        { id: 'P7', type: 'CHAdeMO', power: '50kW', status: 'available', rate: 8.5 },
        { id: 'P8', type: 'Type2', power: '22kW', status: 'available', rate: 6.0 },
        { id: 'P9', type: 'CCS', power: '150kW', status: 'available', rate: 12.0 },
        { id: 'P10', type: 'Type2', power: '11kW', status: 'occupied', rate: 5.5 },
        { id: 'P11', type: 'CCS', power: '50kW', status: 'available', rate: 8.5 },
        { id: 'P12', type: 'CHAdeMO', power: '50kW', status: 'maintenance', rate: 8.5 }
      ]
    }
  ];
  const { stationId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stationId) {
      // If no stationId, use mock data for the first station
      setSelectedStation(station[0]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Use the correct API endpoint
        const response = await apiConnector("GET", `${stationEndpoints.GET_STATION_BY_ID_API}/${stationId}`);
        
        if (response.data && response.data.success) {
          const stationData = response.data.data;
          setData(stationData);
          setSelectedStation(stationData);
        } else {
          // Fallback to mock data if API fails
          console.warn("API failed, using mock data");
          setSelectedStation(station[0]);
        }
      } catch (err) {
        console.error("Error fetching station data:", err);
        // Fallback to mock data on error
        setSelectedStation(station[0]);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);

  console.log("Station data:", { data, selectedStation });

  // Timer countdown effect
  useEffect(() => {
    if (currentView === 'confirmation' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentView, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = (stationId) => {
    setFavorites(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };
 
  const calculateCharging = () => {
    if (!selectedPort) return { time: 0, cost: 0 };
    
    const targetBattery = 80; // Assume charging to 80%
    const batteryToCharge = Math.max(0, targetBattery - batteryLevel);
    
    // Safely parse power value
    const powerStr = selectedPort.power || '0kW';
    const power = parseInt(powerStr.replace('kW', '')) || 1;
    const rate = selectedPort.rate || 0;
    
    // Calculate with safety checks
    const estimatedTime = Math.max(1, Math.round((batteryToCharge * 60) / power)); // in minutes
    const estimatedCost = Math.round((batteryToCharge * rate * 0.6)) || 0; // Rough calculation
    
    return { 
      time: isNaN(estimatedTime) ? 0 : estimatedTime, 
      cost: isNaN(estimatedCost) ? 0 : estimatedCost 
    };
  };

  const handleBookSlot = () => {
    if (!selectedStation) {
      console.error("No station selected");
      return;
    }

    setIsBooking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Check if station has available ports
      const availablePorts = data?.availableSlots || selectedStation.availablePorts || 0;
      if (availablePorts === 0) {
        setShowWaitlist(true);
        setIsBooking(false);
        return;
      }
      setCurrentView('booking');
      setIsBooking(false);
    }, 500);
  };

  const handleProceedToPay = () => {
    setCurrentView('payment');
  };

  // Mobile-first responsive header component
  const MobileHeader = () => (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <button
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900">Station Details</h1>
      <button
        onClick={() => toggleFavorite(selectedStation?.id)}
        className={`p-2 rounded-lg transition-colors ${
          favorites.includes(selectedStation?.id) 
            ? 'text-red-500 bg-red-50' 
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <Heart className={`w-5 h-5 ${favorites.includes(selectedStation?.id) ? 'fill-current' : ''}`} />
      </button>
    </div>
  );

  const StationCard = ({ station }) => {
    // Safety checks for station data
    if (!station) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading station data...</p>
          </div>
        </div>
      );
    }

    // Ensure all required properties exist with defaults
    const safeStation = {
      id: station.id || 'unknown',
      name: station.name || 'Unknown Station',
      image: station.image || 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=400&fit=crop',
      rating: station.rating || 0,
      reviews: station.reviews || 0,
      distance: station.distance || 'Unknown',
      manager: station.manager || 'Unknown',
      facilities: station.facilities || [],
      availablePorts: station.availablePorts || 0,
      totalPorts: station.totalPorts || 1,
      pricePerUnit: station.pricePerUnit || 0,
      ports: station.ports || []
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        
        {/* Hero Image Section */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img 
            src={safeStation.image} 
            alt={data?.name || safeStation.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-8rem)]">
            {data?.availableSlots === 0 && (
              <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Station Full
                </div>
              </div>
            )}
            {data?.availableSlots > 0 && data?.availableSlots <= 3 && (
              <div className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Limited Slots
                </div>
              </div>
            )}
            {safeStation.rating >= 4.7 && (
              <div className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Premium
                </div>
              </div>
            )}
          </div>

          {/* Station Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2">
              {data?.name || safeStation.name}
            </h2>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span className="font-medium">{safeStation.rating}</span>
                <span className="text-sm">({safeStation.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                <span className="text-sm">{safeStation.distance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {data?.availableSlots || safeStation.availablePorts}
              </div>
              <div className="text-xs text-gray-600 font-medium">Available</div>
              <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-2">
                <div 
                  className="h-1.5 bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${safeStation.totalPorts > 0 ? 
                      ((data?.availableSlots || safeStation.availablePorts) / (data?.totalSlots || safeStation.totalPorts)) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data?.totalSlots || safeStation.totalPorts}
              </div>
              <div className="text-xs text-gray-600 font-medium">Total Ports</div>
              <div className="flex justify-center mt-2 gap-1">
                {Array.from({ length: Math.min((data?.totalSlots || safeStation.totalPorts), 6) }, (_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                ))}
                {(data?.totalSlots || safeStation.totalPorts) > 6 && (
                  <span className="text-xs text-gray-500">+{(data?.totalSlots || safeStation.totalPorts) - 6}</span>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {(data?.totalSlots || safeStation.totalPorts) - (data?.availableSlots || safeStation.availablePorts)}
              </div>
              <div className="text-xs text-gray-600 font-medium">In Use</div>
              <div className="w-full bg-red-100 h-1.5 rounded-full mt-2">
                <div 
                  className="h-1.5 bg-red-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${safeStation.totalPorts > 0 ? 
                      (((data?.totalSlots || safeStation.totalPorts) - (data?.availableSlots || safeStation.availablePorts)) / (data?.totalSlots || safeStation.totalPorts)) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {data?.address || safeStation.location}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                  <button className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    Call Station
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Manager Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {(safeStation.manager || 'M').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Station Manager</h3>
                <p className="text-gray-600 text-sm">{safeStation.manager}</p>
                <p className="text-blue-600 text-sm font-medium">{data?.contact}</p>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-gray-600" />
              Facilities
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {safeStation.facilities.map((facility, index) => {
                const facilityConfig = {
                  WiFi: { icon: <Wifi className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  Cafe: { icon: <Coffee className="w-4 h-4" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  Security: { icon: <Shield className="w-4 h-4" />, color: 'bg-green-50 text-green-700 border-green-200' },
                  Parking: { icon: <Car className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                  Restroom: { icon: <MapPin className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                  'Food Court': { icon: <Coffee className="w-4 h-4" />, color: 'bg-orange-50 text-orange-700 border-orange-200' }
                };
                
                const config = facilityConfig[facility] || { 
                  icon: <MapPin className="w-4 h-4" />, 
                  color: 'bg-gray-50 text-gray-700 border-gray-200' 
                };
                
                return (
                  <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}>
                    {config.icon}
                    <span className="text-sm font-medium">{facility}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Port Types */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Available Port Types</h3>
            <div className="flex flex-wrap gap-2">
              {[...new Set(safeStation.ports.filter(p => p.status === 'available').map(p => p.type))].map((type, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={() => {
              setSelectedStation(station);
              handleBookSlot();
            }}
            disabled={isBooking}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              (data?.availableSlots || safeStation.availablePorts) === 0
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            } ${isBooking ? 'opacity-75 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
          >
            {isBooking ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (data?.availableSlots || safeStation.availablePorts) === 0 ? (
              <>
                <Clock className="w-5 h-5" />
                Join Waitlist
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Book Charging Slot
              </>
            )}
          </button>
        </div>

        {/* Bottom padding to account for fixed button */}
        <div className="h-20" />
      </div>
    );
  };

  const PortSelection = () => (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-3xl sm:rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {selectedStation?.name || data?.name}
              </h2>
              <p className="text-gray-600 text-sm truncate">Select charging port</p>
            </div>
            <button
              onClick={() => setCurrentView('stations')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Port Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Available Ports
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {selectedStation?.ports.map((port) => (
                <div
                  key={port.id}
                  onClick={() => port.status === 'available' && setSelectedPort(port)}
                  className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                    port.status === 'available'
                      ? selectedPort?.id === port.id
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                        : 'border-green-500 bg-green-50 hover:bg-green-100 cursor-pointer hover:scale-105'
                      : port.status === 'occupied'
                      ? 'border-red-500 bg-red-50 cursor-not-allowed opacity-75'
                      : 'border-gray-500 bg-gray-50 cursor-not-allowed opacity-75'
                  }`}
                >
                  <div className="text-center">
                    <Zap className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
                      port.status === 'available' ? 'text-green-600' :
                      port.status === 'occupied' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <div className="text-sm font-bold">{port.id}</div>
                    <div className="text-xs text-gray-600">{port.type}</div>
                    <div className="text-xs text-gray-600">{port.power}</div>
                  </div>
                  {selectedPort?.id === port.id && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium">Maintenance</span>
            </div>
          </div>

          {/* Charging Configuration */}
          {selectedPort && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl mb-6 border border-blue-100">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Battery className="w-5 h-5 text-blue-600" />
                Charging Configuration
              </h4>
              
              <div className="space-y-4">
                {/* Battery Level Slider */}
                <div className="bg-white p-4 rounded-xl">
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    Current Battery Level: {batteryLevel}%
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={batteryLevel}
                      onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #f59e0b ${batteryLevel/2}%, #10b981 ${batteryLevel}%, #e5e7eb ${batteryLevel}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10%</span>
                      <span>50%</span>
                      <span>90%</span>
                    </div>
                  </div>
                </div>

                {/* Port Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl text-center">
                    <div className="text-sm text-gray-600 mb-1">Port Type</div>
                    <div className="font-bold text-blue-600">{selectedPort.type}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl text-center">
                    <div className="text-sm text-gray-600 mb-1">Power</div>
                    <div className="font-bold text-green-600">{selectedPort.power}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl text-center">
                    <div className="text-sm text-gray-600 mb-1">Rate</div>
                    <div className="font-bold text-orange-600">₹{selectedPort.rate}/kWh</div>
                  </div>
                </div>
                
                {/* Estimation Card */}
                <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Timer className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Estimated Time</span>
                      </div>
                      <div className="font-bold text-xl text-blue-600">{calculateCharging().time} min</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200 mx-4"></div>
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CreditCard className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Estimated Cost</span>
                      </div>
                      <div className="font-bold text-xl text-green-600">₹{calculateCharging().cost}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Button */}
        <div className="sticky bottom-0 p-4 sm:p-6 bg-white border-t border-gray-200">
          <button
            onClick={handleProceedToPay}
            disabled={!selectedPort || isBooking}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              !selectedPort || isBooking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isBooking ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Payment Component
  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handlePayment = async (event) => {
      event.preventDefault();
      
      setProcessing(true);

      try {
        const charging = calculateCharging();
        
        // Create booking directly (simplified for now)
        const bookingPayload = {
          stationId: selectedStation.id || stationId || '1',
          evId: null, // Will be handled by backend
          slotId: `${selectedPort.id}-${Date.now()}`, // Make slot ID unique
          startTime: new Date(Date.now() + 1 * 60 * 1000).toISOString(), // Start 1 minute from now
          endTime: new Date(Date.now() + (charging.time + 1) * 60 * 1000).toISOString(),
          estimatedCost: charging.cost,
          batteryLevel: batteryLevel,
          portType: selectedPort.type
        };

        console.log('Creating booking with payload:', bookingPayload);

        const bookingResponse = await apiConnector('POST', bookingEndpoints.CREATE_BOOKING_API, bookingPayload);
        
        if (bookingResponse.data && bookingResponse.data.success) {
          const booking = {
            id: bookingResponse.data.data.bookingId,
            station: selectedStation,
            port: selectedPort,
            estimatedTime: charging.time,
            estimatedCost: charging.cost,
            batteryLevel,
            timestamp: new Date().toLocaleString(),
            bookingData: bookingResponse.data.data.booking
          };
          
          setBookingData(booking);
          setCurrentView('confirmation');
          setTimeRemaining(1800);
          toast.success('Booking confirmed successfully!');
        } else {
          throw new Error(bookingResponse.data?.message || 'Booking failed');
        }
      } catch (error) {
        console.error('Payment error:', error);
        toast.error(error.message || 'Failed to create booking. Please try again.');
      } finally {
        setProcessing(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
        <div className="bg-white rounded-t-3xl sm:rounded-xl w-full sm:max-w-md max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-3xl sm:rounded-t-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>
              <button 
                onClick={() => setCurrentView('booking')} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handlePayment} className="p-4 sm:p-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Station:</span>
                  <span className="font-medium">{selectedStation?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Port:</span>
                  <span className="font-medium">{selectedPort?.id} ({selectedPort?.type})</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Time:</span>
                  <span className="font-medium">{calculateCharging().time} min</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span>₹{calculateCharging().cost}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Pay on Arrival (Cash/UPI)</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  You can pay at the charging station using cash or UPI
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                processing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Confirming Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Booking
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const ConfirmationScreen = () => (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-xl w-full sm:max-w-md max-h-[95vh] overflow-y-auto">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-3xl sm:rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Booking Confirmed</h2>
            <button 
              onClick={() => navigate('/u/dashboard')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Success Animation */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600">Your charging slot has been reserved</p>
          </div>

          {/* QR Code */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-6 text-center border">
            <QrCode className="w-32 h-32 mx-auto mb-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-700 mb-2">Scan QR code at the station</p>
            <p className="text-xs text-gray-500">Show this code to the station operator</p>
          </div>

          {/* Booking Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Booking Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Booking ID</span>
                <span className="font-mono font-medium text-blue-600">{bookingData?.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Station</span>
                <span className="font-medium text-right flex-1 ml-4 truncate">{bookingData?.station.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Port</span>
                <span className="font-medium">{bookingData?.port.id} ({bookingData?.port.type})</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Estimated Time</span>
                <span className="font-medium">{bookingData?.estimatedTime} minutes</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm">Estimated Cost</span>
                <span className="font-bold text-green-600 text-lg">₹{bookingData?.estimatedCost}</span>
              </div>
            </div>
          </div>

          {/* Timer Warning */}
          <div className={`p-4 rounded-xl mb-6 border-2 ${
            timeRemaining <= 600 
              ? 'bg-red-50 border-red-200' 
              : timeRemaining <= 1200 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full ${
                timeRemaining <= 600 
                  ? 'bg-red-100' 
                  : timeRemaining <= 1200 
                  ? 'bg-orange-100' 
                  : 'bg-blue-100'
              }`}>
                <Clock className={`w-5 h-5 ${
                  timeRemaining <= 600 
                    ? 'text-red-600' 
                    : timeRemaining <= 1200 
                    ? 'text-orange-600' 
                    : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h4 className={`font-semibold ${
                  timeRemaining <= 600 
                    ? 'text-red-800' 
                    : timeRemaining <= 1200 
                    ? 'text-orange-800' 
                    : 'text-blue-800'
                }`}>
                  Time to Reach Station
                </h4>
                <div className={`text-2xl font-bold ${
                  timeRemaining <= 600 
                    ? 'text-red-600' 
                    : timeRemaining <= 1200 
                    ? 'text-orange-600' 
                    : 'text-blue-600'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
            <p className={`text-sm ${
              timeRemaining <= 600 
                ? 'text-red-700' 
                : timeRemaining <= 1200 
                ? 'text-orange-700' 
                : 'text-blue-700'
            }`}>
              {timeRemaining <= 600 
                ? 'Hurry! Your booking will expire soon.' 
                : timeRemaining <= 1200 
                ? 'Please reach the station within the time limit.' 
                : 'You have plenty of time to reach the station.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => {
                const { latitude, longitude } = selectedStation;
                if (latitude && longitude) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
                  window.open(url, '_blank');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </button>
            
            <button
              onClick={() => navigate('/u/dashboard')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const WaitlistModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-xl w-full sm:max-w-md">
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-200 rounded-t-3xl sm:rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Station Full</h2>
            <button 
              onClick={() => setShowWaitlist(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">All Slots Occupied</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            All charging ports at <span className="font-semibold">{selectedStation?.name || data?.name}</span> are currently occupied. 
            Join our waitlist to get notified when a slot becomes available.
          </p>

          {/* Waitlist Benefits */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-semibold text-orange-800 mb-3">Waitlist Benefits:</h4>
            <ul className="space-y-2 text-sm text-orange-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                Instant notification when slot is available
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                Priority booking for 5 minutes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                No additional charges
              </li>
            </ul>
          </div>

          {/* Estimated Wait Time */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Estimated Wait Time</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">15-30 minutes</div>
            <p className="text-sm text-blue-700 mt-1">Based on current usage patterns</p>
          </div>

          <div className="space-y-3">
            <button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => {
                // Add waitlist logic here
                setShowWaitlist(false);
                // Show success message or redirect
              }}
            >
              Join Waitlist
            </button>
            <button
              onClick={() => setShowWaitlist(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Find Another Station
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading station details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !selectedStation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Station Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't load the station details. Please try again.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <StationCard key={station[0].id} station={station[0]} />

        {/* Modals */}
        {currentView === 'booking' && <PortSelection />}
        {currentView === 'payment' && <PaymentForm />}
        {currentView === 'confirmation' && <ConfirmationScreen />}
        {showWaitlist && <WaitlistModal />}
      </div>
    </Elements>
  );
};

export default BookSlotPage;
