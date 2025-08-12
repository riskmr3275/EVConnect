import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, MapPin, Clock, Zap, Car, CreditCard, CheckCircle, X } from 'lucide-react';
import { apiConnector } from '../../services/apiconnector';
import { stationEndpoints, bookingEndpoints, evEndpoints, chargingSlotsEndpoints } from '../../services/api';
import PaymentModal from '../Payment/PaymentModal';
import { toast } from 'react-toastify';

const EnhancedBookSlotPage = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  // State management
  const [currentView, setCurrentView] = useState('booking'); // booking, payment, confirmation
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEV, setSelectedEV] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: 1, // hours
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [userEVs, setUserEVs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load station details and user EVs on component mount
  useEffect(() => {
    if (stationId) {
      loadStationDetails();
      loadUserEVs();
    }
  }, [stationId]);

  // Calculate total amount when booking details change
  useEffect(() => {
    if (selectedSlot && bookingDetails.duration) {
      const ratePerHour = selectedSlot.powerLevel * 8; // ₹8 per kWh
      setTotalAmount(ratePerHour * bookingDetails.duration);
    }
  }, [selectedSlot, bookingDetails.duration]);

  const loadStationDetails = async () => {
    try {
      setLoading(true);
      const response = await apiConnector('GET', `${stationEndpoints.GET_STATION_BY_ID_API}/${stationId}`);
      if (response.data.success) {
        setSelectedStation(response.data.data);
        loadAvailableSlots();
      }
    } catch (error) {
      console.error('Error loading station details:', error);
      toast.error('Failed to load station details');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const response = await apiConnector('GET', `${chargingSlotsEndpoints.GET_STATION_SLOTS_API}/${stationId}`);
      if (response.data.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load available slots');
    }
  };

  const loadUserEVs = async () => {
    try {
      const response = await apiConnector('GET', evEndpoints.GET_USER_EVS_API);
      if (response.data.success) {
        setUserEVs(response.data.data);
        // Auto-select default EV if available
        const defaultEV = response.data.data.find(ev => ev.isDefault);
        if (defaultEV) setSelectedEV(defaultEV);
      }
    } catch (error) {
      console.error('Error loading EVs:', error);
      toast.error('Failed to load your EVs');
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !selectedEV || !bookingDetails.date || !bookingDetails.startTime || !bookingDetails.endTime) {
      toast.error('Please fill in all booking details');
      return;
    }

    // Validate booking time
    const startDateTime = new Date(`${bookingDetails.date}T${bookingDetails.startTime}`);
    const endDateTime = new Date(`${bookingDetails.date}T${bookingDetails.endTime}`);
    const now = new Date();

    if (startDateTime <= now) {
      toast.error('Booking start time must be in the future');
      return;
    }

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        stationId: stationId,
        evId: selectedEV.id,
        slotId: selectedSlot.id,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      };

      const response = await apiConnector('POST', bookingEndpoints.CREATE_BOOKING_API, bookingData);
      
      if (response.data.success) {
        setBookingId(response.data.booking.id);
        // Show payment modal immediately after booking creation
        setTimeout(() => {
          setShowPaymentModal(true);
        }, 100); // Small delay to ensure state is updated
        toast.success('Booking created! Please complete payment to confirm.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes('not available')) {
        // Refresh available slots
        loadAvailableSlots();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setShowPaymentModal(false);
    setCurrentView('confirmation');
    toast.success('Payment successful! Your booking is confirmed.');
    
    // Send confirmation email, update booking status, etc.
    setTimeout(() => {
      navigate('/dashboard/addCv'); // Navigate to bookings page
    }, 3000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    toast.info('Payment cancelled. Your booking is still pending.');
  };

  // Render booking form
  const renderBookingForm = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Station Header */}
        {selectedStation && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <h1 className="text-2xl font-bold">{selectedStation.name}</h1>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{selectedStation.address}</span>
            </div>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 mr-1 fill-current" />
              <span>4.8 (120 reviews)</span>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* EV Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Select Your EV</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEVs.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEV(ev)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedEV?.id === ev.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{ev.brand} {ev.model}</h4>
                      <p className="text-sm text-gray-600">{ev.licensePlate}</p>
                      <p className="text-sm text-gray-500">{ev.batteryCapacity} kWh</p>
                    </div>
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slot Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Select Charging Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSlot?.id === slot.id
                      ? 'border-green-500 bg-green-50'
                      : slot.isOccupied
                      ? 'border-red-200 bg-red-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={slot.isOccupied}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Slot {slot.id.slice(-4)}</span>
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600">{slot.type}</p>
                  <p className="text-sm font-medium">{slot.powerLevel} kW</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {slot.isOccupied ? 'Occupied' : 'Available'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={bookingDetails.startTime}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={bookingDetails.endTime}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Booking Summary */}
          {selectedSlot && bookingDetails.duration > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Charging Rate:</span>
                  <span>₹{selectedSlot.powerLevel * 8}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{bookingDetails.duration} hour(s)</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBookingSubmit}
              disabled={loading || !selectedSlot || !selectedEV}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <CreditCard className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Creating Booking...' : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && bookingId && (
        <PaymentModal
          bookingId={bookingId}
          amount={totalAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );

  // Render confirmation screen
  const renderConfirmation = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your charging slot has been successfully booked and payment processed.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold mb-2">Booking Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Station:</span>
              <span>{selectedStation?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{bookingDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{bookingDetails.startTime} - {bookingDetails.endTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/addCv')}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );

  if (loading && !selectedStation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'booking' && renderBookingForm()}
      {currentView === 'confirmation' && renderConfirmation()}
    </div>
  );
};

export default EnhancedBookSlotPage;