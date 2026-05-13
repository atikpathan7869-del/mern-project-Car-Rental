// Controller/driverController.js
const manageDriver = require("../DBOperation/manageDriver");

class driverController {
  //  CREATE Driver
  saveDriver = async (req, res) => {
    try {
      const result = await manageDriver.SaveDriver(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  READ All Drivers
  getDrivers = async (req, res) => {
    try {
      const result = await manageDriver.GetDrivers();
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  UPDATE Driver
  updateDriver = async (req, res) => {
    try {
      const id = req.params.id; // DriverId from URL
      const result = await manageDriver.UpdateDriver(id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  DELETE Driver
  deleteDriver = async (req, res) => {
    try {
      const id = req.params.id; // DriverId from URL
      const result = await manageDriver.DeleteDriver(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };
}

module.exports = new driverController();
