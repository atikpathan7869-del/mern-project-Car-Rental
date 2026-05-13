// Route/DriverRoute.js
const express = require("express");
const router = express.Router();
const driverController = require("../Controller/driverController");

//  CREATE Driver
router.post("/save", driverController.saveDriver);

//  READ All Drivers
router.get("/", driverController.getDrivers);

//  UPDATE Driver
router.put("/update/:id", driverController.updateDriver);

//  DELETE Driver
router.delete("/delete/:id", driverController.deleteDriver);

module.exports = router;
