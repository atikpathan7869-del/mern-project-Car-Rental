const express = require("express");
const router = express.Router();
const paymentController = require("../Controller/paymentController");

router.post("/save", paymentController.savePayment);

router.get("/", paymentController.getAllPayments);

router.get("/booking/:bookingId", paymentController.getPaymentByBooking);

module.exports = router;
