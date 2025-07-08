const BASE_URL ="http://localhost:4000/api" || "https://your-booking-backend.vercel.app/api/v1"; // Deployed booking backend base URL

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
  CREATE_SLOT_API: BASE_URL + "/chargingSlots/addChargingSlot",            
  GET_ALL_SLOTS_API: BASE_URL + "/chargingSlots/getChargingSlots/:stationId",  //get all charging slot of a station        
  UPDATE_SLOT_API: BASE_URL + "/chargingSlots/",         // not done 
  DELETE_SLOT_API: BASE_URL + "/chargingSlots/",           // not done
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


// ====================== ADMIN DASHBOARD ======================
export const evEndpoints = {
  ADD_EV_API: BASE_URL + "/evs/addEV",      
  GET_EV_API: BASE_URL + "/evs/getEV",      
  GET_EV_BY_ID: BASE_URL + "/evs/getEVById/:id",
}

// ====================== ADMIN DASHBOARD ======================
export const stationEndpoints = {
  GET_STATION_BY_LOCATION: BASE_URL + "/stations/getStationByLocation",   
  ADD_STATION: BASE_URL + "/stations/addStation",   
  GET_ALL_STATION: BASE_URL + "/stations/getAllStations",
  GET_STATION_BY_ID: BASE_URL + "/stations/getStationById/:id",
}

 

 

