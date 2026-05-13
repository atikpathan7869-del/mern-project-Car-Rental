const express = require("express");
const router = express.Router();
const carController = require("../Controller/CarController");

// CREATE: Save/Register Car (Base64 image upload supported)
router.post("/save", carController.saveRequest);

// READ: Get all cars
router.get("/", carController.getAllCars);

// READ: Get car by _id
router.get("/:id", carController.getCarById);

// UPDATE: Update car by _id
router.put("/:id", carController.updateCar);

// DELETE: Delete car by _id
router.delete("/:id", carController.deleteCar);

module.exports = router;
