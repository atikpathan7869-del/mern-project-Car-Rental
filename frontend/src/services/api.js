import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

/* ================= USER APIs ================= */

export const loginUser = (data) => API.post("/user/login", data);
export const registerUser = (data) => API.post("/user/register", data);
export const getAllUsers = () => API.get("/user");
export const getUserById = (id) => API.get(`/user/${id}`);
export const updateUser = (id, data) => API.put(`/user/${id}`, data);
export const deleteUser = (id) => API.delete(`/user/${id}`);
export const changePasswordApi = (userId, data) =>
  API.put(`/user/change-password/${userId}`, data);

/* ================= VEHICLE APIs ================= */

// 1. Fixed the path from "/" to "/vehicle/save" to match router.post("/save")
export const addVehicle = (data) => API.post("/vehicle/save", data);

export const getVehicles = () => API.get("/vehicle");

// 2. Fixed double slashes and added missing prefix
export const getVehicleById = (id) => API.get(`/vehicle/${id}`); 

// 3. Fixed double slashes and added missing prefix
export const updateVehicle = (id, data) => API.put(`/vehicle/${id}`, data);

// 4. Fixed double slashes and added missing prefix
export const deleteVehicle = (id) => API.delete(`/vehicle/${id}`);
/* ================= BOOKING APIs ================= */

// Create Booking
export const saveBooking = (data) =>
  API.post("/booking/save", data);

// Get All Bookings
export const getAllBookings = () =>
  API.get("/booking/all");

// Get Booking By Id
export const getBookingById = (id) =>
  API.get(`/booking/${id}`);

// Get Bookings by User
export const getUserBookings = (userId) =>
  API.get(`/booking/mybookings/${userId}`);

// Cancel Booking
export const cancelBooking = (id) =>
  API.put(`/booking/cancel/${id}`);

// Update Booking
export const updateBooking = (id, data) =>
  API.put(`/booking/update/${id}`, data);

// Delete Booking
export const deleteBooking = (id) =>
  API.delete(`/booking/delete/${id}`);


//  ADMIN APIs 
export const loginAdmin = (data) => API.post("/admin/login", data);
export const registerAdmin = (data) => API.post("/admin/register", data);
export const getAdmins = () => API.get("/admin");
export const getAdminById = (id) => API.get(`/admin/${id}`);
export const updateAdmin = (id, data) => API.put(`/admin/${id}`, data);
export const deleteAdmin = (id) => API.delete(`/admin/${id}`);
export const changeAdminPasswordApi = (id, data) => API.put(`/admin/change-password/${id}`, data);
//export const chnagePasswordRequest = (id) => API.put(`/admin/ChangePassword/${id}`);



/* ================= PAYMENT APIs ================= */

export const savePayment = (data) =>
  API.post("/payment/save", data);

export const getPayments = () =>
  API.get("/payment");

export const getPaymentByBooking = (bookingId) =>
  API.get(`/payment/booking/${bookingId}`);