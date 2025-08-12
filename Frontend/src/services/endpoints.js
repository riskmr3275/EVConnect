// Base URL for API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Auth endpoints
export const authEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  SIGNUP_API: BASE_URL + "/auth/register",
  RESETPASSTOKEN_API: BASE_URL + "/auth/forgot-password",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  LOGOUT_API: BASE_URL + "/auth/logout",
};

// Station endpoints
export const stationEndpoints = {
  GET_ALL_STATIONS_API: BASE_URL + "/stations",
  GET_STATION_BY_ID_API: BASE_URL + "/stations",
  CREATE_STATION_API: BASE_URL + "/stations/create",
  UPDATE_STATION_API: BASE_URL + "/stations",
  DELETE_STATION_API: BASE_URL + "/stations",
  GET_OWNER_STATIONS_API: BASE_URL + "/stations/owner-stations",
  SEARCH_STATIONS_API: BASE_URL + "/stations/search",
  GET_NEARBY_STATIONS_API: BASE_URL + "/stations/nearby",
};

// EV endpoints
export const evEndpoints = {
  GET_USER_EVS_API: BASE_URL + "/evs/user-evs",
  GET_EV_API: BASE_URL + "/evs/user-evs", // Added for Test1.jsx compatibility
  GET_EV_BY_ID_API: BASE_URL + "/evs",
  CREATE_EV_API: BASE_URL + "/evs/create",
  ADD_EV_API: BASE_URL + "/evs/create", // Added for Test1.jsx compatibility
  UPDATE_EV_API: BASE_URL + "/evs",
  DELETE_EV_API: BASE_URL + "/evs",
  SET_DEFAULT_EV_API: BASE_URL + "/evs",
};

// Booking endpoints
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

// Transaction endpoints
export const transactionEndpoints = {
  CREATE_PAYMENT_INTENT_API: BASE_URL + "/transactions/create-payment-intent",
  CONFIRM_PAYMENT_API: BASE_URL + "/transactions/confirm-payment",
  GET_USER_TRANSACTIONS_API: BASE_URL + "/transactions/user-transactions",
  PROCESS_REFUND_API: BASE_URL + "/transactions/refund",
  APPLY_PENALTY_API: BASE_URL + "/transactions/penalty",
  GET_TRANSACTION_ANALYTICS_API: BASE_URL + "/transactions/analytics",
};

// Charging History endpoints
export const chargingHistoryEndpoints = {
  START_CHARGING_SESSION_API: BASE_URL + "/charging-history/start-session",
  END_CHARGING_SESSION_API: BASE_URL + "/charging-history/end-session",
  GET_USER_CHARGING_HISTORY_API: BASE_URL + "/charging-history/user-history",
  GET_STATION_CHARGING_ANALYTICS_API: BASE_URL + "/charging-history/station-analytics",
  GET_CHARGING_SESSION_DETAILS_API: BASE_URL + "/charging-history/session",
  GET_ENERGY_CONSUMPTION_ANALYTICS_API: BASE_URL + "/charging-history/energy-analytics",
};

// Notification endpoints
export const notificationEndpoints = {
  GET_USER_NOTIFICATIONS_API: BASE_URL + "/notifications/user-notifications",
  MARK_AS_READ_API: BASE_URL + "/notifications",
  MARK_ALL_AS_READ_API: BASE_URL + "/notifications/mark-all-read",
  DELETE_NOTIFICATION_API: BASE_URL + "/notifications",
  GET_NOTIFICATION_STATS_API: BASE_URL + "/notifications/stats",
};

// Review endpoints
export const reviewEndpoints = {
  CREATE_REVIEW_API: BASE_URL + "/reviews/create",
  GET_STATION_REVIEWS_API: BASE_URL + "/reviews/station",
  GET_USER_REVIEWS_API: BASE_URL + "/reviews/user-reviews",
  UPDATE_REVIEW_API: BASE_URL + "/reviews",
  DELETE_REVIEW_API: BASE_URL + "/reviews",
  GET_REVIEW_STATS_API: BASE_URL + "/reviews/stats",
  GET_TOP_RATED_STATIONS_API: BASE_URL + "/reviews/top-rated",
};

// Charging Slots endpoints
export const chargingSlotsEndpoints = {
  GET_STATION_SLOTS_API: BASE_URL + "/chargingSlots/station",
  CREATE_SLOT_API: BASE_URL + "/chargingSlots/create",
  UPDATE_SLOT_API: BASE_URL + "/chargingSlots",
  DELETE_SLOT_API: BASE_URL + "/chargingSlots",
  GET_SLOT_AVAILABILITY_API: BASE_URL + "/chargingSlots",
};

// Station Masters endpoints
export const stationMastersEndpoints = {
  GET_STATION_MASTERS_API: BASE_URL + "/stationmasters",
  CREATE_STATION_MASTER_API: BASE_URL + "/stationmasters/create",
  UPDATE_STATION_MASTER_API: BASE_URL + "/stationmasters",
  DELETE_STATION_MASTER_API: BASE_URL + "/stationmasters",
  GET_STATION_MASTER_DETAILS_API: BASE_URL + "/stationmasters",
};