import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import VehicleList from "./user/pages/VehicleList";
import Booking from "./user/pages/Booking";
import Home from "./user/pages/Home";
import About from "./user/pages/about";
import Profile from "./user/pages/ProfilePage";
import CarDetails from "./user/pages/CarDetails";
import PaymentPage from "./user/pages/PaymentPage";
// Layouts
import UserLayout from "./user/pages/components/UserLayout";
import AdminLayout from "./admin/pages/components/AdminLayout";
import AdminPrivateRoute from "./admin/pages/components/AdminPrivateRoute";

// Admin Pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRegister from "./admin/pages/AdminRegister"; 
import AdminDashboard from "./admin/pages/AdminDashboard";
import ManageCars from "./admin/pages/ManageCars";
import ManageBookings from "./admin/pages/ManageBookings";
import AddCar from "./admin/pages/AddCars";
import UserManage from "./admin/pages/UserManege";
import EditCar from "./admin/pages/EditCar";
import UserBookings from "./admin/pages/UserBookings";
import AdminProfile from "./admin/pages/AdminProfile";
import PaymentLogs from "./admin/pages/PaymentLogs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User side with layout */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
            <Route path="/vehicle/:id" element={<CarDetails />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

        {/* Admin Login (no layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} /> 

       <Route path="/admin" element={<AdminPrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="Deshboard" element={<AdminDashboard />} />
          <Route path="cars" element={<ManageCars />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="add-car" element={<AddCar />} /> 
          <Route path="edit-car/:id" element={<EditCar />} />
          <Route path="Users" element={<UserManage />} /> 
          <Route path="Adminpayments" element={<PaymentLogs />} /> 
        <Route path="users/:userId" element={<UserBookings />} />

        </Route>
      </Route>


      </Routes>
    </BrowserRouter>
  );
}
