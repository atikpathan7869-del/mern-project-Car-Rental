// Controller/vehicleTariffController.js
const manageVehicleTariff = require("../DBOperation/manageVehicleTariff");

class vehicleTariffController {
  //  CREATE Tariff
  saveTariff = async (req, res) => {
    try {
      const result = await manageVehicleTariff.SaveVehicleTariff(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  READ All Tariffs
  getTariffs = async (req, res) => {
    try {
      const result = await manageVehicleTariff.GetVehicleTariffs();
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  UPDATE Tariff
  updateTariff = async (req, res) => {
    try {
      const id = req.params.id; // TariffId from URL
      const result = await manageVehicleTariff.UpdateVehicleTariff(id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  DELETE Tariff
  deleteTariff = async (req, res) => {
    try {
      const id = req.params.id; // TariffId from URL
      const result = await manageVehicleTariff.DeleteVehicleTariff(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };
}

module.exports = new vehicleTariffController();
