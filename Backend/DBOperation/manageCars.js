const { firebaseDB } = require("../Faierbase_Config/index");

class ManageCars {
  // CREATE: Save new car with Firestore counter auto-increment
  SaveCars = async (carData) => {
    try {
      const carCollection = firebaseDB.collection("Vehicle");

      // Duplicate VehicleNumber check
      const existing = await carCollection
        .where("VehicleNumber", "==", carData.VehicleNumber)
        .get();

      if (!existing.empty) {
        return { Data: "Vehicle already exists", Status: "Fail" };
      }

      // Auto-increment _id using counter doc
      const counterRef = firebaseDB.collection("Counters").doc("CarCounter");
      const counterDoc = await counterRef.get();
      let newId = 1;

      if (counterDoc.exists) {
        newId = counterDoc.data().lastId + 1;
      }

      await counterRef.set({ lastId: newId });

      // New Car Object
      const newCar = {
        _id: newId,
        VehicleNumber: carData.VehicleNumber,
        Brand: carData.Brand,
        Model: carData.Model,
        Year: carData.Year,
        Type: carData.Type,
        FuelType: carData.FuelType,
        SeatingCapacity: carData.SeatingCapacity,
        PricePerDay: carData.PricePerDay,
        PricePerKm: carData.PricePerKm || null,
        Status: "Available",
        Color: carData.Color || null,
        Description: carData.Description || null,
        minimum_rent_km: carData.minimum_rent_km || null,
        carImg: carData.carImg,
        CreatedDate: new Date().toISOString(),
      };

      const doc = await carCollection.add(newCar);

      return {
        Status: "Ok",
        Data: "Successfully Saved",
        FirestoreId: doc.id,
        Car: newCar,
      };
    } catch (err) {
      console.error("Error saving car:", err);
      return { Status: "Fail", Data: err.message };
    }
  };

 GetAllCars = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]; 
    
    const carSnapshot = await firebaseDB.collection("Vehicle").get();
    const bookingSnapshot = await firebaseDB.collection("Bookings").get();

    const allBookings = bookingSnapshot.docs.map(doc => doc.data().Booking);
    const cars = carSnapshot.docs.map((doc) => {
      const carData = doc.data();
      
      // 1. Check if this car is booked for TODAY via Bookings collection
      const isBookedToday = allBookings.find(b => 
        b.VehicleId === carData._id.toString() && 
        today >= b.pick_date && 
        today <= b.return_date &&
        b.payment_status !== "Cancelled"
      );

      // 2. PRIORITY LOGIC:
      // Agar manual status "Maintenance" hai to wahi rahega.
      // Warna agar aaj ki booking hai to "Booked".
      // Warna jo database mein saved status hai wahi rahega.
      let finalStatus = carData.Status; 

      if (carData.Status !== "Maintenance") {
        if (isBookedToday) {
          finalStatus = "Booked";
        } else {
          // Yahan hum database mein saved status ko respect karenge
          finalStatus = carData.Status || "Available";
        }
      }

      return {
        Id: doc.id,
        Car: {
          ...carData,
          Status: finalStatus
        },
      };
    });

    return { Status: "Ok", Data: cars };
  } catch (err) {
    return { Status: "Fail", Data: err.message };
  }
};
  // READ: Get car by _id
  GetCarById = async (id) => {
    try {
      const snapshot = await firebaseDB
        .collection("Vehicle")
        .where("_id", "==", parseInt(id))
        .get();

      if (snapshot.empty) return { Status: "Fail", Data: "Car Not Found" };

      let car = null;
      snapshot.forEach((doc) => {
        car = { Id: doc.id, Car: doc.data() };
      });

      return { Status: "Ok", Data: car };
    } catch (err) {
      return { Status: "Fail", Data: err.message };
    }
  };

  // UPDATE: Update car by _id
  UpdateCar = async (id, carData) => {
    try {
      const snapshot = await firebaseDB
        .collection("Vehicle")
        .where("_id", "==", parseInt(id))
        .get();

      if (snapshot.empty) return { Status: "Fail", Data: "Car Not Found" };

      let docId = null;
      snapshot.forEach((doc) => (docId = doc.id));

      await firebaseDB.collection("Vehicle").doc(docId).update({
        ...carData,
        UpdatedDate: new Date().toISOString(),
      });

      return { Status: "Ok", Data: "Successfully Updated" };
    } catch (err) {
      return { Status: "Fail", Data: err.message };
    }
  };

  // DELETE: Delete car by _id
  DeleteCar = async (id) => {
    try {
      const snapshot = await firebaseDB
        .collection("Vehicle")
        .where("_id", "==", parseInt(id))
        .get();

      if (snapshot.empty) return { Status: "Fail", Data: "Car Not Found" };

      let docId = null;
      snapshot.forEach((doc) => (docId = doc.id));

      await firebaseDB.collection("Vehicle").doc(docId).delete();

      return { Status: "Ok", Data: "Successfully Deleted" };
    } catch (err) {
      return { Status: "Fail", Data: err.message };
    }
  };
}

module.exports = new ManageCars();
