const BASE_URL = process.env.BASE_URL || "https://your-booking-backend.vercel.app/api/v1"; // Deployed booking backend base URL

// ====================== AUTH ENDPOINTS ======================
export const authEndpoints = {
  REGISTER_API: BASE_URL + "/auth/register",       // Register user (student/admin)
  LOGIN_API: BASE_URL + "/auth/login",             // Login user
  LOGOUT_API: BASE_URL + "/auth/logout",           // Logout user
  GET_ME_API: BASE_URL + "/auth/me",               // Get logged-in user details
}
// ====================== STATION_MASTER ENDPOINTS ======================
export const stationMasterEndpoints = {
  STATIONMASTER_REGISTER_API: BASE_URL + "/stationmasters/addStationMaster", // Register station master
  STATIONMATER_LOGIN_API: BASE_URL + "/auth/login", // Login station master
  GET_STATIONMASTER_API: BASE_URL + "/stationmasters/getStationMaster/:id", // Get station master by ID
  UPDATE_STATIONMASTER_API: BASE_URL + "/stationmasters/updateStationMaster/:id", // Update station master by ID
}

// ====================== USER ENDPOINTS ======================
export const userEndpoints = {
  GET_USER_BY_ID: BASE_URL + "/users/",            // + userId - Get specific user
  GET_ALL_USERS: BASE_URL + "/users/all",          // Admin: Get all users
}

// ====================== SLOT ENDPOINTS ======================
export const slotEndpoints = {
  CREATE_SLOT_API: BASE_URL + "/slots",            // Admin: Create a new slot
  GET_ALL_SLOTS_API: BASE_URL + "/slots",          // Get all available slots
  UPDATE_SLOT_API: BASE_URL + "/slots/",           // + slotId - Update a slot
  DELETE_SLOT_API: BASE_URL + "/slots/",           // + slotId - Delete a slot
}

// ====================== BOOKING ENDPOINTS ======================
export const bookingEndpoints = {
  CREATE_BOOKING_API: BASE_URL + "/bookings",             // Student: Book a slot
  CANCEL_BOOKING_API: BASE_URL + "/bookings/",            // + bookingId - Cancel a booking
  RESCHEDULE_BOOKING_API: BASE_URL + "/bookings/",        // + bookingId - Reschedule
  GET_USER_BOOKINGS_API: BASE_URL + "/bookings/user/",    // + userId - Get user's bookings
  GET_SLOT_BOOKINGS_API: BASE_URL + "/bookings/slot/",    // + slotId - Admin: See bookings for slot
}

// ====================== ADMIN DASHBOARD ======================
export const adminEndpoints = {
  DASHBOARD_DATA_API: BASE_URL + "/admin/dashboard",      // Admin analytics
}
