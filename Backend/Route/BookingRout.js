const express = require("express");
const router = express.Router();
const bookingController = require("../Controller/BookingController");

router.post("/save", bookingController.saveBooking);

router.get("/mybookings/:userId", bookingController.getBookingsByUser);

router.put("/cancel/:id", bookingController.cancelBooking);

router.put("/update-status/:id", bookingController.updateBookingStatus);

router.put("/update/:id", bookingController.updateBooking);

router.get("/all", bookingController.getAllBookings);

router.delete("/delete/:id", bookingController.deleteBooking);

router.get("/:id", bookingController.getBookingById);

module.exports = router;