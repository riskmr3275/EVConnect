import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Zap, MapPin, RefreshCw, X, CheckCircle, AlertCircle, Filter, Search, QrCode, Eye } from 'lucide-react';
import { apiConnector } from '../../services/apiconnector';
import { bookingEndpoints } from '../../services/api';
import { toast } from 'react-toastify';
import QRCodeDisplay from '../common/QRCodeDisplay';

const MyBookings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'upcoming' ? 'CONFIRMED,PENDING' : 'CHARGING_DONE,CANCELLED';
      const response = await apiConnector('GET', `${bookingEndpoints.GET_USER_BOOKINGS_API}?status=${status}&limit=20`);
      
      if (response.data.success) {
        setBookings(response.data.bookings || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleShowQR = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await apiConnector('DELETE', `${bookingEndpoints.CANCEL_BOOKING_API}/${bookingId}`, {
        reason: 'User cancelled'
      });

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        loadBookings(); // Reload bookings
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Calculate user stats from bookings
  const userStats = {
    totalBookings: bookings.length,
    upcomingBookings: bookings.filter(b => ['CONFIRMED', 'PENDING'].includes(b.status)).length,
    completedSessions: bookings.filter(b => b.status === 'CHARGING_DONE').length,
    cancelledSessions: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return ['CONFIRMED', 'PENDING', 'CHARGING'].includes(booking.status);
    } else {
      return ['CHARGING_DONE', 'CANCELLED'].includes(booking.status);
    }
  });

  const BookingCard = ({ booking, type }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-200';
        case 'CHARGING_DONE': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
        case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'CHARGING': return 'bg-purple-50 text-purple-700 border-purple-200';
        default: return 'bg-gray-50 text-gray-700 border-gray-200';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
        case 'CHARGING_DONE': return <CheckCircle className="w-4 h-4" />;
        case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
        case 'CHARGING': return <Zap className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'CONFIRMED': return 'Confirmed';
        case 'CHARGING_DONE': return 'Completed';
        case 'CANCELLED': return 'Cancelled';
        case 'PENDING': return 'Pending';
        case 'CHARGING': return 'Charging';
        default: return status;
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString();
      }
    };

    const formatTime = (startTime, endTime) => {
      const start = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const end = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${start} - ${end}`;
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{booking.station?.name || 'Unknown Station'}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{booking.station?.address || 'Unknown Location'}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
            {getStatusIcon(booking.status)}
            <span className="capitalize">{getStatusText(booking.status)}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(booking.startTime)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatTime(booking.startTime, booking.endTime)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm">Connector: {booking.slot?.type || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm">Power: {booking.slot?.powerLevel || 0} kW</span>
          </div>
          {booking.chargingHistory && (
            <div className="flex items-center text-gray-600">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm">Energy: {booking.chargingHistory.energyUsed} kWh</span>
            </div>
          )}
        </div>

        {/* Cost */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 text-sm">
            {type === 'upcoming' ? 'Estimated Cost' : 'Total Cost'}
          </span>
          <span className="font-bold text-lg text-green-600">
            ₹{booking.transaction?.amount || booking.chargingHistory?.cost || 'TBD'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {type === 'upcoming' ? (
            <>
              {booking.status === 'CONFIRMED' && booking.qrCode && (
                <button 
                  onClick={() => handleShowQR(booking)}
                  className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  Show QR
                </button>
              )}
              <button 
                onClick={() => handleCancelBooking(booking.id)}
                className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Book Again
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900 mb-4">My Bookings</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming ({userStats.upcomingBookings})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past ({userStats.completedSessions + userStats.cancelledSessions})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{userStats.upcomingBookings}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{userStats.completedSessions}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{userStats.cancelledSessions}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} type={activeTab} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-gray-600">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming bookings. Book a charging slot to get started!"
                : "You don't have any past bookings yet."
              }
            </p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Booking QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <QRCodeDisplay 
                bookingId={selectedBooking.id} 
                type="booking" 
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
