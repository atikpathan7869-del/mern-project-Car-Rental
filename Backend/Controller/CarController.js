const manageCars = require("../DBOperation/manageCars");
const { uploadFile } = require("../Repositories/FileUpload");

class CarController {
  // CREATE
  saveRequest = async (req, res) => {
    try {
      const fileName = `img_${Date.now()}_${Math.round(Math.random() * 1e6)}.png`;

      // ❗ use correct field names
      const {
        VehicleNumber,
        Brand,
        Model,
        Year,
        Type,
        FuelType,
        SeatingCapacity,
        PricePerDay,
        PricePerKm,
        Status,
        Color,
        Description,
        minimum_rent_km,
        base64  // 👈 you must send this in request body
      } = req.body;

      const jsonRequest = {
        VehicleNumber,
        Brand,
        Model,
        Year,
        Type,
        FuelType,        // ✔ was missing before
        SeatingCapacity,
        PricePerDay,
        PricePerKm: PricePerKm || null,
        Status: Status || "Available",
        Color: Color || null,
        Description: Description || null,
        minimum_rent_km: minimum_rent_km || null,
        carImg: fileName,
      };

      const result = await manageCars.SaveCars(jsonRequest);

      // ❗ Fix case match
      if (result.Status === "Ok") {
        await uploadFile(base64, fileName); // ✔ await added
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // READ ALL
  getAllCars = async (req, res) => {
    try {
      const result = await manageCars.GetAllCars();
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(400).json(result);
    } catch (err) {
      res.status(500).json({ Data: err.message, Status: "Fail" });
    }
  };

  // READ BY _id
  getCarById = async (req, res) => {
    try {
      const result = await manageCars.GetCarById(req.params.id);
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (err) {
      res.status(500).json({ Data: err.message, Status: "Fail" });
    }
  };

  // UPDATE
  updateCar = async (req, res) => {
    try {
      const result = await manageCars.UpdateCar(req.params.id, req.body);
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (err) {
      res.status(500).json({ Data: err.message, Status: "Fail" });
    }
  };

  // DELETE
  deleteCar = async (req, res) => {
    try {
      const result = await manageCars.DeleteCar(req.params.id);
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (err) {
      res.status(500).json({ Data: err.message, Status: "Fail" });
    }
  };
}

module.exports = new CarController();
