import React, { useState } from 'react';
import QRCodeDisplay from '../common/QRCodeDisplay';
import { toast } from 'react-toastify';

const QRCodeTest = () => {
  const [testBookingId, setTestBookingId] = useState('');
  const [testStationId, setTestStationId] = useState('');
  const [showBookingQR, setShowBookingQR] = useState(false);
  const [showStationQR, setShowStationQR] = useState(false);

  const handleTestBookingQR = () => {
    if (!testBookingId.trim()) {
      toast.error('Please enter a booking ID');
      return;
    }
    setShowBookingQR(true);
  };

  const handleTestStationQR = () => {
    if (!testStationId.trim()) {
      toast.error('Please enter a station ID');
      return;
    }
    setShowStationQR(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Code System Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Booking QR Test */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Test Booking QR Code</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={testBookingId}
                onChange={(e) => setTestBookingId(e.target.value)}
                placeholder="Enter Booking ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTestBookingQR}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Booking QR
              </button>
            </div>
          </div>

          {/* Station QR Test */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Test Station QR Code</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={testStationId}
                onChange={(e) => setTestStationId(e.target.value)}
                placeholder="Enter Station ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTestStationQR}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate Station QR
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Displays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {showBookingQR && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Booking QR Code</h3>
              <QRCodeDisplay 
                bookingId={testBookingId} 
                type="booking" 
                className="w-full"
              />
            </div>
          )}

          {showStationQR && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Station QR Code</h3>
              <QRCodeDisplay 
                stationId={testStationId} 
                type="station" 
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Feature Status */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Implementation Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Payment Page Fixed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">QR Code System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Enhanced Booking System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Profile Management</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Settings Functionality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Responsive Design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Navigation Map</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Database Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeTest;