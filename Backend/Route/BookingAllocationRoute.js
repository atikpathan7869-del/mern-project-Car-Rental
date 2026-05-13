// Route/BookingAllocationRoute.js
const express = require("express");
const router = express.Router();
const bookingAllocationController = require("../Controller/bookingAllocationController");

//  CREATE Allocation
router.post("/save", bookingAllocationController.saveAllocation);

//  READ All Allocations
router.get("/", bookingAllocationController.getAllocations);

//  UPDATE Allocation
router.put("/update/:id", bookingAllocationController.updateAllocation);

//  DELETE Allocation
router.delete("/delete/:id", bookingAllocationController.deleteAllocation);

module.exports = router;
