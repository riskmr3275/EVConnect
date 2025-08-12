import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';
import { toast } from 'react-toastify';

export const useSocket = () => {
  const { user } = useSelector((state) => state.profile);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect socket when user is logged in
    if (user) {
      socketRef.current = socketService.connect();
      
      // Setup notification listener
      socketService.onNewNotification((notification) => {
        toast.info(notification.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      // Setup payment update listener
      socketService.onPaymentUpdate((paymentData) => {
        if (paymentData.status === 'success') {
          toast.success('Payment successful!');
        } else if (paymentData.status === 'failed') {
          toast.error('Payment failed. Please try again.');
        }
      });

      return () => {
        socketService.removeAllListeners();
        socketService.disconnect();
      };
    }
  }, [user]);

  return {
    socket: socketRef.current,
    isConnected: socketService.getConnectionStatus(),
    joinStation: socketService.joinStation.bind(socketService),
    leaveStation: socketService.leaveStation.bind(socketService),
    onBookingUpdate: socketService.onBookingUpdate.bind(socketService),
    onSlotAvailabilityUpdate: socketService.onSlotAvailabilityUpdate.bind(socketService),
    onChargingSessionUpdate: socketService.onChargingSessionUpdate.bind(socketService),
  };
};

export default useSocket;