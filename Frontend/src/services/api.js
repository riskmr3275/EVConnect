import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  baseURL:'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
};

// Legacy endpoints for backward compatibility
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const authEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  SIGNUP_API: BASE_URL + "/auth/register",
  RESETPASSTOKEN_API: BASE_URL + "/auth/forgot-password",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  LOGOUT_API: BASE_URL + "/auth/logout",
  UPDATE_PROFILE_API: BASE_URL + "/auth/update-profile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",
  DELETE_ACCOUNT_API: BASE_URL + "/auth/delete-account",
};

export const evEndpoints = {
  GET_USER_EVS_API: BASE_URL + "/evs/user-evs",
  GET_EV_API: BASE_URL + "/evs/getEV", // Updated to match backend route
  GET_EV_BY_ID_API: BASE_URL + "/evs",
  GET_EV_BY_ID: BASE_URL + "/evs/getEVById", // Added for compatibility
  CREATE_EV_API: BASE_URL + "/evs/create",
  ADD_EV_API: BASE_URL + "/evs/addEV", // Updated to match backend route
  UPDATE_EV_API: BASE_URL + "/evs",
  DELETE_EV_API: BASE_URL + "/evs",
  SET_DEFAULT_EV_API: BASE_URL + "/evs",
};

export const stationEndpoints = {
  GET_ALL_STATIONS_API: BASE_URL + "/stations",
  GET_STATION_BY_ID_API: BASE_URL + "/stations",
  CREATE_STATION_API: BASE_URL + "/stations/create",
  ADD_STATION: BASE_URL + "/stations/create", // Added for OwnerApi.jsx compatibility
  UPDATE_STATION_API: BASE_URL + "/stations",
  DELETE_STATION_API: BASE_URL + "/stations",
  GET_OWNER_STATIONS_API: BASE_URL + "/stations/owner-stations",
  SEARCH_STATIONS_API: BASE_URL + "/stations/search",
  GET_NEARBY_STATIONS_API: BASE_URL + "/stations/nearby",
  GET_STATION_BY_LOCATION: BASE_URL + "/stations/getStationByLocation", // Added for EVChargingStationFinder.jsx
  GET_ALL_STATION: BASE_URL + "/stations/getAllStations", // Added for compatibility
};

export const stationMasterEndpoints = {
  GET_STATION_MASTERS_API: BASE_URL + "/stationmasters",
  CREATE_STATION_MASTER_API: BASE_URL + "/stationmasters/create",
  STATIONMASTER_REGISTER_API: BASE_URL + "/stationmasters/addStationMaster", // Updated to match backend
  STATIONMATER_LOGIN_API: BASE_URL + "/auth/login", // Added for compatibility
  GET_STATIONMASTER_API: BASE_URL + "/stationmasters/getStationMaster", // Added for compatibility
  UPDATE_STATIONMASTER_API: BASE_URL + "/stationmasters/updateStationMaster", // Added for compatibility
  UPDATE_STATION_MASTER_API: BASE_URL + "/stationmasters",
  DELETE_STATION_MASTER_API: BASE_URL + "/stationmasters",
  GET_STATION_MASTER_DETAILS_API: BASE_URL + "/stationmasters",
};

// Station API calls
export const stationAPI = {
  getAllStations: (params) => api.get('/stations', { params }),
  getStationById: (id) => api.get(`/stations/${id}`),
  createStation: (stationData) => api.post('/stations/create', stationData),
  updateStation: (id, stationData) => api.put(`/stations/${id}`, stationData),
  deleteStation: (id) => api.delete(`/stations/${id}`),
  getStationsByOwner: (params) => api.get('/stations/owner-stations', { params }),
  searchStations: (params) => api.get('/stations/search', { params }),
  getNearbyStations: (params) => api.get('/stations/nearby', { params }),
};

// EV API calls
export const evAPI = {
  getUserEVs: (params) => api.get('/evs/user-evs', { params }),
  getEVById: (id) => api.get(`/evs/${id}`),
  createEV: (evData) => api.post('/evs/create', evData),
  updateEV: (id, evData) => api.put(`/evs/${id}`, evData),
  deleteEV: (id) => api.delete(`/evs/${id}`),
  setDefaultEV: (id) => api.put(`/evs/${id}/set-default`),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings/create', bookingData),
  getUserBookings: (params) => api.get('/bookings/user-bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancelBooking: (id, reason) => api.delete(`/bookings/${id}`, { data: { reason } }),
  getStationBookings: (stationId, params) => api.get(`/bookings/station/${stationId}`, { params }),
  checkAvailability: (params) => api.get('/bookings/availability/check', { params }),
  getBookingAnalytics: (params) => api.get('/bookings/analytics/data', { params }),
};

// Transaction API calls
export const transactionAPI = {
  createPaymentIntent: (data) => api.post('/transactions/create-payment-intent', data),
  confirmPayment: (data) => api.post('/transactions/confirm-payment', data),
  getUserTransactions: (params) => api.get('/transactions/user-transactions', { params }),
  processRefund: (data) => api.post('/transactions/refund', data),
  applyPenalty: (data) => api.post('/transactions/penalty', data),
  getTransactionAnalytics: (params) => api.get('/transactions/analytics', { params }),
};

// Charging History API calls
export const chargingHistoryAPI = {
  startChargingSession: (data) => api.post('/charging-history/start-session', data),
  endChargingSession: (data) => api.post('/charging-history/end-session', data),
  getUserChargingHistory: (params) => api.get('/charging-history/user-history', { params }),
  getStationChargingAnalytics: (stationId, params) => api.get(`/charging-history/station-analytics/${stationId}`, { params }),
  getChargingSessionDetails: (sessionId) => api.get(`/charging-history/session/${sessionId}`),
  getEnergyConsumptionAnalytics: (params) => api.get('/charging-history/energy-analytics', { params }),
};

// Notification API calls
export const notificationAPI = {
  getUserNotifications: (params) => api.get('/notifications/user-notifications', { params }),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  getNotificationStats: () => api.get('/notifications/stats'),
};

// Review API calls
export const reviewAPI = {
  createReview: (reviewData) => api.post('/reviews/create', reviewData),
  getStationReviews: (stationId, params) => api.get(`/reviews/station/${stationId}`, { params }),
  getUserReviews: (params) => api.get('/reviews/user-reviews', { params }),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getReviewStats: (stationId) => api.get(`/reviews/stats/${stationId}`),
  getTopRatedStations: (params) => api.get('/reviews/top-rated', { params }),
};

// Charging Slots API calls
export const chargingSlotsAPI = {
  getStationSlots: (stationId) => api.get(`/chargingSlots/station/${stationId}`),
  createSlot: (slotData) => api.post('/chargingSlots/create', slotData),
  updateSlot: (slotId, slotData) => api.put(`/chargingSlots/${slotId}`, slotData),
  deleteSlot: (slotId) => api.delete(`/chargingSlots/${slotId}`),
  getSlotAvailability: (slotId, params) => api.get(`/chargingSlots/${slotId}/availability`, { params }),
};

// Station Masters API calls
export const stationMastersAPI = {
  getStationMasters: (params) => api.get('/stationmasters', { params }),
  createStationMaster: (data) => api.post('/stationmasters/create', data),
  updateStationMaster: (id, data) => api.put(`/stationmasters/${id}`, data),
  deleteStationMaster: (id) => api.delete(`/stationmasters/${id}`),
  getStationMasterDetails: (id) => api.get(`/stationmasters/${id}`),
};

// Additional endpoints for new components
export const reviewEndpoints = {
  CREATE_REVIEW_API: BASE_URL + "/reviews/create",
  GET_STATION_REVIEWS_API: BASE_URL + "/reviews/station",
  GET_USER_REVIEWS_API: BASE_URL + "/reviews/user-reviews",
  UPDATE_REVIEW_API: BASE_URL + "/reviews",
  DELETE_REVIEW_API: BASE_URL + "/reviews",
  GET_REVIEW_STATS_API: BASE_URL + "/reviews/stats",
  GET_TOP_RATED_STATIONS_API: BASE_URL + "/reviews/top-rated",
};

export const transactionEndpoints = {
  CREATE_PAYMENT_INTENT_API: BASE_URL + "/transactions/create-payment-intent",
  CONFIRM_PAYMENT_API: BASE_URL + "/transactions/confirm-payment",
  GET_USER_TRANSACTIONS_API: BASE_URL + "/transactions/user-transactions",
  PROCESS_REFUND_API: BASE_URL + "/transactions/refund",
  APPLY_PENALTY_API: BASE_URL + "/transactions/penalty",
  GET_TRANSACTION_ANALYTICS_API: BASE_URL + "/transactions/analytics",
};

export const notificationEndpoints = {
  GET_USER_NOTIFICATIONS_API: BASE_URL + "/notifications/user-notifications",
  MARK_AS_READ_API: BASE_URL + "/notifications",
  MARK_ALL_AS_READ_API: BASE_URL + "/notifications/mark-all-read",
  DELETE_NOTIFICATION_API: BASE_URL + "/notifications",
  GET_NOTIFICATION_STATS_API: BASE_URL + "/notifications/stats",
};

export const bookingEndpoints = {
  CREATE_BOOKING_API: BASE_URL + "/bookings/create",
  GET_USER_BOOKINGS_API: BASE_URL + "/bookings/user-bookings",
  GET_BOOKING_BY_ID_API: BASE_URL + "/bookings",
  UPDATE_BOOKING_API: BASE_URL + "/bookings",
  CANCEL_BOOKING_API: BASE_URL + "/bookings",
  GET_STATION_BOOKINGS_API: BASE_URL + "/bookings/station",
  CHECK_AVAILABILITY_API: BASE_URL + "/bookings/availability/check",
  GET_BOOKING_ANALYTICS_API: BASE_URL + "/bookings/analytics/data",
};

export const chargingSlotsEndpoints = {
  GET_STATION_SLOTS_API: BASE_URL + "/chargingSlots/station",
  CREATE_SLOT_API: BASE_URL + "/chargingSlots/addChargingSlot", // Updated to match backend
  GET_ALL_SLOTS_API: BASE_URL + "/chargingSlots/getChargingSlots", // Added for compatibility
  UPDATE_SLOT_API: BASE_URL + "/chargingSlots",
  DELETE_SLOT_API: BASE_URL + "/chargingSlots",
  GET_SLOT_AVAILABILITY_API: BASE_URL + "/chargingSlots",
};

// Legacy slot endpoints for compatibility
export const slotEndpoints = {
  CREATE_SLOT_API: BASE_URL + "/chargingSlots/addChargingSlot",
  GET_ALL_SLOTS_API: BASE_URL + "/chargingSlots/getChargingSlots",
  UPDATE_SLOT_API: BASE_URL + "/chargingSlots",
  DELETE_SLOT_API: BASE_URL + "/chargingSlots",
};

export const chargingHistoryEndpoints = {
  START_CHARGING_SESSION_API: BASE_URL + "/charging-history/start-session",
  END_CHARGING_SESSION_API: BASE_URL + "/charging-history/end-session",
  GET_USER_CHARGING_HISTORY_API: BASE_URL + "/charging-history/user-history",
  GET_STATION_CHARGING_ANALYTICS_API: BASE_URL + "/charging-history/station-analytics",
  GET_CHARGING_SESSION_DETAILS_API: BASE_URL + "/charging-history/session",
  GET_ENERGY_CONSUMPTION_ANALYTICS_API: BASE_URL + "/charging-history/energy-analytics",
};

export const geocodingEndpoints = {
  GEOCODE_ADDRESS_API: BASE_URL + "/geocoding/geocode",
  REVERSE_GEOCODE_API: BASE_URL + "/geocoding/reverse",
  GET_NEARBY_PLACES_API: BASE_URL + "/geocoding/nearby",
  CALCULATE_DISTANCE_API: BASE_URL + "/geocoding/distance",
};

export const qrCodeEndpoints = {
  GENERATE_BOOKING_QR_API: BASE_URL + "/qr-codes/booking",
  GENERATE_STATION_QR_API: BASE_URL + "/qr-codes/station",
  VERIFY_QR_CODE_API: BASE_URL + "/qr-codes/verify",
  GENERATE_CHARGING_SESSION_QR_API: BASE_URL + "/qr-codes/charging-session",
};

// QR Code API calls
export const qrCodeAPI = {
  generateBookingQR: (bookingId) => api.get(`/qr-codes/booking/${bookingId}`),
  generateStationQR: (stationId) => api.get(`/qr-codes/station/${stationId}`),
  verifyQRCode: (qrData) => api.post('/qr-codes/verify', { qrData }),
  generateChargingSessionQR: (bookingId, sessionData) => api.post(`/qr-codes/charging-session/${bookingId}`, { sessionData }),
};

export default api;