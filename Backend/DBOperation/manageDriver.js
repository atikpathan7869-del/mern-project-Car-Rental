// DBOperation/manageDriver.js
const { dbConfig } = require("./DBConfig");

class manageDriver {
  // CREATE Driver
  SaveDriver = async (data) => {
    try {
      const db = await dbConfig();
      const driverCollection = db.collection("DriverMaster");

      //  Check duplicate by Email or Aadhar
      const existing = await driverCollection.findOne({
        $or: [{ Email: data.Email }, { AadharId: data.AadharId }]
      });
      if (existing) {
        return { Status: "Fail", Data: "Driver with same Email or Aadhar already exists" };
      }

      //  Auto-increment Id
      const lastDriver = await driverCollection.find().sort({ _id: -1 }).limit(1).toArray();
      let newId = 1;
      if (lastDriver.length > 0) {
        newId = lastDriver[0]._id + 1;
      }

      const newDriver = {
        _id: newId,
        Full_name: data.Full_name,
        Address: data.Address,
        Contact_no: data.Contact_no,
        Email: data.Email,
        Doj: new Date(data.Doj),
        License_number: data.License_number,
        AadharId: data.AadharId,
        AvailabilityStatus: data.AvailabilityStatus || "Available", // default available
        CreateDate: new Date(),
      };

      const result = await driverCollection.insertOne(newDriver);

      return { Status: "OK", Data: "Driver Saved", InsertedId: result.insertedId };
    } catch (error) {
      console.error("Error saving driver:", error);
      return { Status: "Fail", Data: error.message };
    }
  };

  //  READ All Drivers
  GetDrivers = async () => {
    try {
      const db = await dbConfig();
      const driverCollection = db.collection("DriverMaster");

      const result = await driverCollection.find().toArray();

      return { Status: "OK", Data: result };
    } catch (error) {
      console.error("Error fetching drivers:", error);
      return { Status: "Fail", Data: error.message };
    }
  };

  //  UPDATE Driver
  UpdateDriver = async (id, updateData) => {
    try {
      const db = await dbConfig();
      const driverCollection = db.collection("DriverMaster");

      const driverId = parseInt(id);

      //  Check if Driver exists
      const existing = await driverCollection.findOne({ _id: driverId });
      if (!existing) {
        return { Status: "Fail", Data: "DriverId does not exist" };
      }

      //  Prevent duplicate email/aadhar if updated
      if (updateData.Email || updateData.AadharId) {
        const duplicate = await driverCollection.findOne({
          $and: [
            { _id: { $ne: driverId } },
            {
              $or: [
                updateData.Email ? { Email: updateData.Email } : {},
                updateData.AadharId ? { AadharId: updateData.AadharId } : {},
              ],
            },
          ],
        });
        if (duplicate) {
          return { Status: "Fail", Data: "Another driver already has this Email or Aadhar" };
        }
      }

      if (updateData.Doj) updateData.Doj = new Date(updateData.Doj);

      const result = await driverCollection.updateOne(
        { _id: driverId },
        { $set: updateData }
      );

      return { Status: "OK", Data: "Driver Updated", ModifiedCount: result.modifiedCount };
    } catch (error) {
      console.error("Error updating driver:", error);
      return { Status: "Fail", Data: error.message };
    }
  };

  //  DELETE Driver
  DeleteDriver = async (id) => {
    try {
      const db = await dbConfig();
      const driverCollection = db.collection("DriverMaster");

      const driverId = parseInt(id);

      //  Check if Driver exists
      const existing = await driverCollection.findOne({ _id: driverId });
      if (!existing) {
        return { Status: "Fail", Data: "DriverId does not exist" };
      }

      const result = await driverCollection.deleteOne({ _id: driverId });

      return { Status: "OK", Data: "Driver Deleted", DeletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error deleting driver:", error);
      return { Status: "Fail", Data: error.message };
    }
  };
}

module.exports = new manageDriver();
