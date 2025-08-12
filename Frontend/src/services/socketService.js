import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Initialize socket connection
  connect() {
    if (!this.socket) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
      
      this.socket = io(socketUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join a station room for real-time updates
  joinStation(stationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-station', stationId);
    }
  }

  // Leave a station room
  leaveStation(stationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-station', stationId);
    }
  }

  // Listen for booking updates
  onBookingUpdate(callback) {
    if (this.socket) {
      this.socket.on('booking-update', callback);
    }
  }

  // Listen for slot availability updates
  onSlotAvailabilityUpdate(callback) {
    if (this.socket) {
      this.socket.on('slot-availability-update', callback);
    }
  }

  // Listen for charging session updates
  onChargingSessionUpdate(callback) {
    if (this.socket) {
      this.socket.on('charging-session-update', callback);
    }
  }

  // Listen for new notifications
  onNewNotification(callback) {
    if (this.socket) {
      this.socket.on('new-notification', callback);
    }
  }

  // Listen for payment updates
  onPaymentUpdate(callback) {
    if (this.socket) {
      this.socket.on('payment-update', callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Remove specific listener
  removeListener(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;