// DBOperation/manageVehicleTariff.js
const { dbConfig } = require("./DBConfig");

class manageVehicleTariff {
  //  CREATE Tariff
  SaveVehicleTariff = async (data) => {
    try {
      const db = await dbConfig();
      const tariffCollection = db.collection("VehicleTariff");
      const vehicleCollection = db.collection("Vehicle");

      const vehicleId = parseInt(data.VehicleId);

      //  Check if Vehicle exists
      const vehicle = await vehicleCollection.findOne({ _id: vehicleId });
      if (!vehicle) {
        return { Status: "Fail", Data: "VehicleId does not exist" };
      }

      //  Auto-increment Tariff Id
      const lastTariff = await tariffCollection.find().sort({ _id: -1 }).limit(1).toArray();
      let newId = 1;
      if (lastTariff.length > 0) {
        newId = lastTariff[0]._id + 1;
      }

      const newTariff = {
        _id: newId,
        Destination: data.Destination,
        Price: parseFloat(data.Price),
        VehicleId: vehicleId,
        ApproxKm: parseFloat(data.ApproxKm),
        CreateDate: new Date(),
      };

      const result = await tariffCollection.insertOne(newTariff);

      return { Status: "OK", Data: "Tariff Saved", InsertedId: result.insertedId };
    } catch (error) {
      console.error("Error saving tariff:", error);
      return { Status: "Fail", Data: error.message };
    }
  };

  //  READ All Tariffs (with Vehicle Details)
  GetVehicleTariffs = async () => {
    try {
      const db = await dbConfig();
      const tariffCollection = db.collection("VehicleTariff");

      const result = await tariffCollection.aggregate([
        {
          $lookup: {
            from: "Vehicle",
            localField: "VehicleId",
            foreignField: "_id",
            as: "VehicleDetails",
          },
        },
      ]).toArray();

      return { Status: "OK", Data: result };
    } catch (error) {
      console.error("Error fetching tariffs:", error);
      return { Status: "Fail", Data: error.message };
    }
  };

  //  UPDATE Tariff
  UpdateVehicleTariff = async (id, updateData) => {
    try {
      const db = await dbConfig();
      const tariffCollection = db.collection("VehicleTariff");
      const vehicleCollection = db.collection("Vehicle");

      const tariffId = parseInt(id);

      //  Check if Tariff exists
      const existingTariff = await tariffCollection.findOne({ _id: tariffId });
      if (!existingTariff) {
        return { Status: "Fail", Data: "TariffId does not exist" };
      }

      //  Validate Vehicle if provided
      if (updateData.VehicleId) {
        const vehicle = await vehicleCollection.findOne({ _id: parseInt(updateData.VehicleId) });
        if (!vehicle) {
          return { Status: "Fail", Data: "VehicleId does not exist" };
        }
        updateData.VehicleId = parseInt(updateData.VehicleId);
      }

      if (updateData.Price) updateData.Price = parseFloat(updateData.Price);
      if (updateData.ApproxKm) updateData.ApproxKm = parseFloat(updateData.ApproxKm);

      const result = await tariffCollection.updateOne(
        { _id: tariffId },
        { $set: updateData }
      );

      return { Status: "OK", Data: "Tariff Updated", ModifiedCount: result.modifiedCount };
    } catch (error) {
      console.error("Error updating tariff:", error);
      return { Status: "Fail", Data: error.message };
    }
  };

  //  DELETE Tariff
  DeleteVehicleTariff = async (id) => {
    try {
      const db = await dbConfig();
      const tariffCollection = db.collection("VehicleTariff");

      const tariffId = parseInt(id);

      //  Check if Tariff exists
      const tariff = await tariffCollection.findOne({ _id: tariffId });
      if (!tariff) {
        return { Status: "Fail", Data: "TariffId does not exist" };
      }

      const result = await tariffCollection.deleteOne({ _id: tariffId });

      return { Status: "OK", Data: "Tariff Deleted", DeletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error deleting tariff:", error);
      return { Status: "Fail", Data: error.message };
    }
  };
}

module.exports = new manageVehicleTariff();
