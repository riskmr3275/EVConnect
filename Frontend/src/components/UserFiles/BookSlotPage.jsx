import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Star, MapPin, Clock, Zap, Car, Filter, Heart, QrCode, AlertCircle, CheckCircle, X, Phone, Wifi, Coffee, Shield, CreditCard } from 'lucide-react';
import { apiConnector } from '../../services/apiconnector';
import { stationEndpoints } from '../../services/api';
const BookSlotPage = () => {
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
    console.log("Hello woedl")
    if (!stationId) return;
    console.log("Hello woedl")
    const fetchData = async () => {
      try {
        const url = stationEndpoints.GET_STATION_BY_ID.replace(':id', stationId);
        const response = await apiConnector("GET", url);
        setData(response.data.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);
console.log("object from bookslot page",data)

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
    const batteryToCharge = targetBattery - batteryLevel;
    const power = parseInt(selectedPort.power);
    const estimatedTime = Math.max(1, Math.round((batteryToCharge * 60) / power)); // in minutes
    const estimatedCost = Math.round((batteryToCharge * selectedPort.rate * 0.6)); // Rough calculation
    
    return { time: estimatedTime, cost: estimatedCost };
  };

  const handleBookSlot = () => {
    if (selectedStation.availablePorts === 0) {
      setShowWaitlist(true);
      return;
    }
    setCurrentView('booking');
  };

  const handleProceedToPay = () => {
    const charging = calculateCharging();
    const booking = {
      id: `BK${Date.now()}`,
      station: selectedStation,
      port: selectedPort,
      estimatedTime: charging.time,
      estimatedCost: charging.cost,
      batteryLevel,
      timestamp: new Date().toLocaleString()
    };
    setBookingData(booking);
    setCurrentView('confirmation');
    setTimeRemaining(1800); // Reset 30-minute timer
  };

  const StationCard = ({ station }) => (
    <div className="w-full overflow-visible min-h-full">
      {/* Header Image Section */}
      <div className="relative w-full overflow-visible">
        <img 
          src={station.image} 
          alt={data?.companyName} 
          className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110" 
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent w-full"></div>
        
        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {station.availablePorts === 0 && (
            <div className="bg-red-500 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Station Full
              </div>
            </div>
          )}
          {station.availablePorts > 0 && station.availablePorts <= 3 && (
            <div className="bg-orange-500 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Limited Slots
              </div>
            </div>
          )}
          {station.rating >= 4.7 && (
            <div className="bg-emerald-500 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                Premium
              </div>
            </div>
          )}
        </div>
  
        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(station.id)}
          className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg transform hover:scale-110 ${
            favorites.includes(station.id) 
              ? 'bg-red-500 text-white shadow-red-200' 
              : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${favorites.includes(station.id) ? 'fill-current' : ''}`} />
        </button>
  
        {/* Station Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">{data?.name}</h3>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 space-y-6 overflow-visible">
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
              <span className="font-bold text-yellow-700">{station.rating}</span>
            </div>
            <span className="text-sm text-gray-600">({station.reviews} reviews)</span>
          </div>
          {/* <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">₹{station.pricePerUnit}</div>
            <div className="text-sm text-gray-500">per kWh</div>
          </div> */}
        </div>
  
        {/* Location & Manager Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">{data?.address}</p>
              <p className="text-sm text-blue-600 font-medium">{station.distance} away</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Station Manager</p>
              <p className="text-sm text-gray-600">{station.manager}</p>
              <p className="text-sm text-blue-600 font-medium">{data?.contact}</p>
            </div>
          </div>
        </div>
  
        {/* Facilities Grid */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            Available Facilities
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {station.facilities.map((facility, index) => {
              const facilityConfig = {
                WiFi: { icon: <Wifi className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                Cafe: { icon: <Coffee className="w-4 h-4" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                Security: { icon: <Shield className="w-4 h-4" />, color: 'bg-green-50 text-green-700 border-green-200' },
                Parking: { icon: <Car className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                Restroom: { icon: <MapPin className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                'Food Court': { icon: <Coffee className="w-4 h-4" />, color: 'bg-orange-50 text-orange-700 border-orange-200' }
              };
              
              const config = facilityConfig[facility] || { icon: <MapPin className="w-4 h-4" />, color: 'bg-gray-50 text-gray-700 border-gray-200' };
              
              return (
                <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors hover:shadow-sm ${config.color}`}>
                  {config.icon}
                  <span className="text-sm font-medium">{facility}</span>
                </div>
              );
            })}
          </div>
        </div>
  
        {/* Port Statistics */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Charging Port Status
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-emerald-200">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{data?.availableSlots}</div>
              <div className="text-sm text-emerald-700 font-medium">Available</div>
              <div className="w-full bg-emerald-100 h-2 rounded-full mt-2">
                <div 
                  className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(station.availablePorts / station.totalPorts) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-gray-700 mb-1">{data?.totalSlots}</div>
              <div className="text-sm text-gray-600 font-medium">Total Ports</div>
              <div className="flex items-center justify-center mt-2 gap-1">
                {Array.from({ length: Math.min(station.totalPorts, 8) }, (_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                ))}
                {station.totalPorts > 8 && <span className="text-xs text-gray-500">+{station.totalPorts - 8}</span>}
              </div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-1">{data?.totalSlots - data?.availableSlots}</div>
              <div className="text-sm text-red-700 font-medium">In Use</div>
              <div className="w-full bg-red-100 h-2 rounded-full mt-2">
                <div 
                  className="h-2 bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${((station.totalPorts - station.availablePorts) / station.totalPorts) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Port Types Available */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Available Port Types</h4>
          <div className="flex flex-wrap gap-2">
            {[...new Set(station.ports.filter(p => p.status === 'available').map(p => p.type))].map((type, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200">
                <Zap className="w-3 h-3" />
                <span className="text-sm font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
  
        {/* Action Button */}
        <div className="pt-2 overflow-visible">
          <button
            onClick={() => {
              setSelectedStation(station);
              handleBookSlot();
            }}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform  cursor-pointer max-w-max shadow-lg hover:shadow-xl ${
              station.availablePorts === 0
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-orange-200'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {station.availablePorts === 0 ? (
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
            </div>
          </button>
        </div>
  
        {/* Quick Stats Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            24/7 Available
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Verified Station
          </span>
        </div>
      </div>
    </div>
  );
  

  const PortSelection = () => (
    <div className="fixed inset-0 bg-black/80  flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedStation?.name}</h2>
              <p className="text-gray-600">{selectedStation?.location}</p>
            </div>
            <button
              onClick={() => setCurrentView('stations')}
              className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Charging Port</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {selectedStation?.ports.map((port) => (
                <div
                  key={port.id}
                  onClick={() => port.status === 'available' && setSelectedPort(port)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    port.status === 'available'
                      ? selectedPort?.id === port.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-green-500 bg-green-50 hover:bg-green-100'
                      : port.status === 'occupied'
                      ? 'border-red-500 bg-red-50 cursor-not-allowed'
                      : 'border-gray-500 bg-gray-50 cursor-not-allowed'
                  }`}
                  title={`${port.type} - ${port.power} - ₹${port.rate}/kWh`}
                >
                  <div className="text-center">
                    <Zap className={`w-8 h-8 mx-auto mb-2 ${
                      port.status === 'available' ? 'text-green-600' :
                      port.status === 'occupied' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <div className="text-sm font-medium">{port.id}</div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm">Maintenance</span>
            </div>
          </div>

          {selectedPort && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-3">Charging Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Battery Level (%)</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={batteryLevel}
                    onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm font-medium">{batteryLevel}%</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Port Type:</span>
                    <span className="font-medium">{selectedPort.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Power:</span>
                    <span className="font-medium">{selectedPort.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-medium">₹{selectedPort.rate}/kWh</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Estimated Time</div>
                    <div className="font-bold text-lg">{calculateCharging().time} minutes</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Estimated Cost</div>
                    <div className="font-bold text-lg text-green-600">₹{calculateCharging().cost}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleProceedToPay}
            disabled={!selectedPort}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );

  const ConfirmationScreen = () => (
    <div className="fixed inset-0 bg-black/80  bg-opacity-50 flex items-center justify-center p-4 z-50">
      
      <div className="bg-white rounded-xl max-w-md w-full">
      <div className="absolute  text-gray-500 font-bold  p-3"> <button onClick={() => setCurrentView('stations')} className='cursor-pointer p-2'>Done</button></div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your charging slot has been reserved</p>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <QrCode className="w-24 h-24 mx-auto mb-4 text-gray-600" />
            <p className="text-sm text-gray-600">Scan QR code at the station</p>
          </div>

          <div className="text-left space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">{bookingData?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Station:</span>
              <span className="font-medium">{bookingData?.station.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Port:</span>
              <span className="font-medium">{bookingData?.port.id} ({bookingData?.port.type})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Time:</span>
              <span className="font-medium">{bookingData?.estimatedTime} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-medium text-green-600">₹{bookingData?.estimatedCost}</span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">Time to Reach Station</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{formatTime(timeRemaining)}</div>
            <p className="text-sm text-orange-700 mt-1">
              {timeRemaining <= 0 ? 'Time expired! Additional charges may apply.' : 'Reach within 30 minutes to avoid charges'}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setCurrentView('stations')}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Done
            </button>
            <button className="w-full bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const WaitlistModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">All Slots Full</h2>
          <p className="text-gray-600 mb-6">
            All charging ports at {selectedStation?.name} are currently occupied. 
            Join the waitlist to be notified when a slot becomes available.
          </p>
          <div className="space-y-3">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Join Waitlist
            </button>
            <button
              onClick={() => setShowWaitlist(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
<div className="min-h-screen w-full bg-gray-100">
  {/* Main Content */}
  <div className="w-full py-6">
    <StationCard key={station[0].id} station={station[0]} />
  </div>

  {/* Modals */}
  {currentView === 'booking' && <PortSelection />}
  {currentView === 'confirmation' && <ConfirmationScreen />}
  {showWaitlist && <WaitlistModal />}
</div>

  );
};

export default BookSlotPage;