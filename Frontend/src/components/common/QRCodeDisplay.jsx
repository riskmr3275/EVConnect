import React, { useState, useEffect } from 'react';
import { QrCode, Download, Share2, Copy, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { apiConnector } from '../../services/apiconnector';
import { qrCodeEndpoints } from '../../services/api';
import { toast } from 'react-toastify';

const QRCodeDisplay = ({ bookingId, stationId, type = 'booking', className = '' }) => {
  const [qrCode, setQrCode] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId || stationId) {
      generateQRCode();
    }
  }, [bookingId, stationId, type]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (type === 'booking' && bookingId) {
        response = await apiConnector('GET', `${qrCodeEndpoints.GENERATE_BOOKING_QR_API}/${bookingId}`);
      } else if (type === 'station' && stationId) {
        response = await apiConnector('GET', `${qrCodeEndpoints.GENERATE_STATION_QR_API}/${stationId}`);
      } else {
        throw new Error('Invalid QR code type or missing ID');
      }

      if (response.data.success) {
        setQrCode(response.data.qrCode);
        setQrData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError(error.message || 'Failed to generate QR code');
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${type}-qr-code-${bookingId || stationId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded successfully');
  };

  const copyQRData = async () => {
    if (!qrData) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(qrData, null, 2));
      toast.success('QR code data copied to clipboard');
    } catch (error) {
      console.error('Failed to copy QR data:', error);
      toast.error('Failed to copy QR code data');
    }
  };

  const shareQRCode = async () => {
    if (!qrCode || !navigator.share) {
      toast.error('Sharing not supported on this device');
      return;
    }

    try {
      // Convert data URL to blob
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const file = new File([blob], `${type}-qr-code.png`, { type: 'image/png' });

      await navigator.share({
        title: `${type === 'booking' ? 'Booking' : 'Station'} QR Code`,
        text: `QR code for ${type === 'booking' ? 'your booking' : 'station access'}`,
        files: [file]
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      toast.error('Failed to share QR code');
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Generating QR code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button
          onClick={generateQRCode}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <QrCode className="w-8 h-8 text-gray-400 mb-4" />
        <p className="text-gray-600">No QR code available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              {type === 'booking' ? 'Booking QR Code' : 'Station QR Code'}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
            <img
              src={qrCode}
              alt={`${type} QR Code`}
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* QR Code Info */}
          {qrData && (
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">QR Code Information</h4>
              <div className="space-y-1 text-sm">
                {type === 'booking' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-mono text-gray-900">{qrData.bookingId?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Station:</span>
                      <span className="text-gray-900">{qrData.stationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slot Type:</span>
                      <span className="text-gray-900">{qrData.slotType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Power:</span>
                      <span className="text-gray-900">{qrData.powerLevel} kW</span>
                    </div>
                  </>
                )}
                {type === 'station' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Station:</span>
                      <span className="text-gray-900">{qrData.stationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Slots:</span>
                      <span className="text-gray-900">{qrData.availableSlots}/{qrData.totalSlots}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Generated:</span>
                  <span className="text-gray-900">
                    {new Date(qrData.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full">
            <button
              onClick={downloadQRCode}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={copyQRData}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Data
            </button>
            {navigator.share && (
              <button
                onClick={shareQRCode}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>How to use:</strong> Show this QR code at the charging station to {type === 'booking' ? 'start your charging session' : 'access station information'}.
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;