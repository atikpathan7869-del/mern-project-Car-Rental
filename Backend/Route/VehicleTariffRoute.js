// Route/VehicleTariffRoute.js
const express = require("express");
const router = express.Router();
const vehicleTariffController = require("../Controller/vehicleTariffController");

//  CREATE Tariff
router.post("/save", vehicleTariffController.saveTariff);

//  READ All Tariffs
router.get("/", vehicleTariffController.getTariffs);

//  UPDATE Tariff
router.put("/update/:id", vehicleTariffController.updateTariff);

//  DELETE Tariff
router.delete("/delete/:id", vehicleTariffController.deleteTariff);

module.exports = router;
