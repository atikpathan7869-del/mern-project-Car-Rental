const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const VehicleRoute = require("./Route/CarRoute");
const UserRoute = require("./Route/UserRoute");
const bookingRout = require("./Route/BookingRout");
const bookingAllocation =require("./Route/BookingAllocationRoute");
const VehicleTariffRoute =require("./Route/VehicleTariffRoute");
const DriverRoute = require("./Route/DriverRoute");
const adminRoutes = require("./Route/adminRoutes");
const paymentRoutes = require("./Route/paymentRoutes");
const { uploadFile } = require("./Repositories/FileUpload");

// Middleware (merged + duplicate removed)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// ❗ Removed Vite frontend static (optional improvement)
// app.use(express.static(path.join(__dirname, "frontend")));

app.use("/photos", express.static(path.join(__dirname, "Content/Photo")));

// Routes
app.use("/vehicle", VehicleRoute);
app.use("/user", UserRoute);
app.use("/admin", adminRoutes);
app.use("/booking", bookingRout);
app.use("/allocation", bookingAllocation); // ✔ lowercase fixed
app.use("/vehicle-tariff", VehicleTariffRoute);
app.use("/driver", DriverRoute);
app.use("/payment",paymentRoutes);

// Server (future ready optional env)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
