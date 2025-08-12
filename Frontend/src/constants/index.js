// Account Types
export const ACCOUNT_TYPES = {
  USER: 'USER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  STATIONMASTER: 'STATIONMASTER',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  CHARGING: 'CHARGING',
  CHARGING_DONE: 'CHARGING_DONE',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  PAYMENT: 'PAYMENT',
  PENALTY: 'PENALTY',
  REFUND: 'REFUND',
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

// Slot Types
export const SLOT_TYPES = {
  BHARAT_AC_001: 'BHARAT_AC_001',
  BHARAT_DC_001: 'BHARAT_DC_001',
  TYPE_1_AC: 'TYPE_1_AC',
  TYPE_2_AC: 'TYPE_2_AC',
  GB_T_AC: 'GB_T_AC',
  CCS1_DC: 'CCS1_DC',
  CCS2_DC: 'CCS2_DC',
  GB_T_DC: 'GB_T_DC',
  CHADEMO: 'CHADEMO',
  TESLA_SUPERCHARGER: 'TESLA_SUPERCHARGER',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  BOOKING_CANCELLATION: 'BOOKING_CANCELLATION',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PENALTY_APPLIED: 'PENALTY_APPLIED',
};

// Owner Types
export const OWNER_TYPES = {
  COMPANY: 'COMPANY',
  INDIVIDUAL: 'INDIVIDUAL',
};

// Status Types
export const STATUS_TYPES = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

// Slot Type Labels
export const SLOT_TYPE_LABELS = {
  [SLOT_TYPES.BHARAT_AC_001]: 'Bharat AC 001',
  [SLOT_TYPES.BHARAT_DC_001]: 'Bharat DC 001',
  [SLOT_TYPES.TYPE_1_AC]: 'Type 1 AC',
  [SLOT_TYPES.TYPE_2_AC]: 'Type 2 AC',
  [SLOT_TYPES.GB_T_AC]: 'GB/T AC',
  [SLOT_TYPES.CCS1_DC]: 'CCS1 DC',
  [SLOT_TYPES.CCS2_DC]: 'CCS2 DC',
  [SLOT_TYPES.GB_T_DC]: 'GB/T DC',
  [SLOT_TYPES.CHADEMO]: 'CHAdeMO',
  [SLOT_TYPES.TESLA_SUPERCHARGER]: 'Tesla Supercharger',
};

// Booking Status Labels
export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.CHARGING]: 'Charging',
  [BOOKING_STATUS.CHARGING_DONE]: 'Completed',
};

// Booking Status Colors
export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
  [BOOKING_STATUS.CONFIRMED]: 'text-blue-600 bg-blue-100',
  [BOOKING_STATUS.CANCELLED]: 'text-red-600 bg-red-100',
  [BOOKING_STATUS.CHARGING]: 'text-green-600 bg-green-100',
  [BOOKING_STATUS.CHARGING_DONE]: 'text-gray-600 bg-gray-100',
};

// Transaction Status Colors
export const TRANSACTION_STATUS_COLORS = {
  [TRANSACTION_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
  [TRANSACTION_STATUS.COMPLETED]: 'text-green-600 bg-green-100',
  [TRANSACTION_STATUS.FAILED]: 'text-red-600 bg-red-100',
};

// Account Type Labels
export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.USER]: 'User',
  [ACCOUNT_TYPES.OWNER]: 'Station Owner',
  [ACCOUNT_TYPES.ADMIN]: 'Administrator',
  [ACCOUNT_TYPES.STATIONMASTER]: 'Station Master',
};

// Power Levels (in kW)
export const POWER_LEVELS = {
  SLOW: { min: 3, max: 7, label: 'Slow (3-7 kW)' },
  FAST: { min: 7, max: 22, label: 'Fast (7-22 kW)' },
  RAPID: { min: 22, max: 50, label: 'Rapid (22-50 kW)' },
  ULTRA_RAPID: { min: 50, max: 350, label: 'Ultra Rapid (50+ kW)' },
};

// Common EV Brands
export const EV_BRANDS = [
  'Tesla',
  'Tata',
  'Mahindra',
  'MG Motor',
  'Hyundai',
  'Kia',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Jaguar',
  'Volvo',
  'BYD',
  'Ola Electric',
  'Ather',
  'TVS',
  'Bajaj',
  'Hero Electric',
  'Other',
];

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
  'Andaman and Nicobar Islands',
];

// Time slots for booking (24-hour format)
export const TIME_SLOTS = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
  '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 10,
};

// API timeouts
export const API_TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 30000, // 30 seconds
  PAYMENT: 60000, // 60 seconds
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  LOCATION: 'userLocation',
  PREFERENCES: 'userPreferences',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  BOOKING_SUCCESS: 'Booking created successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
};

// Chart colors for analytics
export const CHART_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280',
];

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 28.6139, lng: 77.2090 }, // New Delhi
  DEFAULT_ZOOM: 10,
  MARKER_COLORS: {
    AVAILABLE: '#10B981',
    OCCUPIED: '#EF4444',
    MAINTENANCE: '#F59E0B',
  },
};

export default {
  ACCOUNT_TYPES,
  BOOKING_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  SLOT_TYPES,
  NOTIFICATION_TYPES,
  OWNER_TYPES,
  STATUS_TYPES,
  SLOT_TYPE_LABELS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  TRANSACTION_STATUS_COLORS,
  ACCOUNT_TYPE_LABELS,
  POWER_LEVELS,
  EV_BRANDS,
  INDIAN_STATES,
  TIME_SLOTS,
  PAGINATION_DEFAULTS,
  FILE_UPLOAD,
  API_TIMEOUTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CHART_COLORS,
  MAP_CONFIG,
};