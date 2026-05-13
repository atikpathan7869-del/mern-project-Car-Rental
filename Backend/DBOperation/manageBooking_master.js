const { firebaseDB } = require("../Faierbase_Config/index");

class ManageBooking {
  async getNextSequence(name) {
    const counterRef = firebaseDB.collection("Counters").doc(name);
    const counterDoc = await counterRef.get();

    let nextId = 1;

    if (counterDoc.exists) {
      nextId = counterDoc.data().seq + 1;
    }

    await counterRef.set({ seq: nextId });

    return nextId;
  }

  // ================= CREATE BOOKING =================

  saveBooking = async (bookingData) => {
    try {
      const vehicleId = parseInt(bookingData.VehicleId);
      const customerId = bookingData.CustomerId; // string Firestore id

      if (isNaN(vehicleId))
        return { Status: "Fail", Data: "Invalid VehicleId" };

      if (!customerId) return { Status: "Fail", Data: "Invalid CustomerId" };

      if (!bookingData.pick_date)
        return { Status: "Fail", Data: "pick_date is required" };

      // CHECK VEHICLE
      const vehicleSnap = await firebaseDB
        .collection("Vehicle")
        .where("_id", "==", vehicleId)
        .get();

      if (vehicleSnap.empty)
        return {
          Status: "Fail",
          Data: `VehicleId ${vehicleId} does not exist`,
        };

      // CHECK USER
      const userSnap = await firebaseDB
        .collection("Users")
        .doc(customerId)
        .get();

      if (!userSnap.exists)
        return {
          Status: "Fail",
          Data: `CustomerId ${customerId} does not exist`,
        };

      // CHECK BOOKING DATE
      const bookingSnap = await firebaseDB
        .collection("booking")
        .where("VehicleId", "==", vehicleId)
        .where("pick_date", "==", bookingData.pick_date)
        .get();

      if (!bookingSnap.empty)
        return { Status: "Fail", Data: "Vehicle already booked for this date" };

      const nextId = await this.getNextSequence("bookingCounter");

      const newBooking = {
        _id: nextId,
        VehicleId: vehicleId,
        CustomerId: customerId,
        bookingDate: new Date().toISOString(),
        pick_date: bookingData.pick_date,
        Pic_address: bookingData.Pic_address || "",
        VehicleId_tarife: bookingData.VehicleId_tarife || null,
        payment_status: bookingData.payment_status || "Pending",
        remark: bookingData.remark || null,
        booking_status: "Active",
        CreatedDate: new Date().toISOString(),
      };

      const doc = await firebaseDB.collection("booking").add(newBooking);

      return {
        Status: "Ok",
        Data: "Booking Successfully Saved",
        Booking: newBooking,
        FirestoreId: doc.id,
      };
    } catch (err) {
      console.error("Error saving booking:", err);
      return { Status: "Fail", Data: err.message };
    }
  };

  // ================= GET ALL BOOKINGS =================

getAllBookings = async () => {

  try {

    const snapshot = await firebaseDB.collection("booking").get();

    const result = [];

    for (const doc of snapshot.docs) {

      const booking = doc.data();

      // VEHICLE
      const vehicleSnap = await firebaseDB
        .collection("Vehicle")
        .where("_id", "==", booking.VehicleId)
        .get();

      // USER
      let userDetails = null;

      if (booking.CustomerId && typeof booking.CustomerId === "string") {

        const userSnap = await firebaseDB
          .collection("Users")
          .doc(booking.CustomerId)
          .get();

        if (userSnap.exists) {
          userDetails = userSnap.data();
        }

      }

      result.push({
        FirestoreId: doc.id,
        Booking: booking,
        CarDetails: vehicleSnap.empty ? null : vehicleSnap.docs[0].data(),
        UserDetails: userDetails
      });

    }

    return {
      Status: "Ok",
      Data: result
    };

  } catch (err) {

    console.error("GetAllBookings Error:", err);

    return {
      Status: "Fail",
      Data: err.message
    };

  }

};

  // ================= GET BOOKING BY ID =================

  getBookingById = async (id) => {
    try {
      if (!id) return { Status: "Fail", Data: "Booking ID required" };

      const doc = await firebaseDB.collection("booking").doc(id).get();

      if (doc.exists) return { Status: "Ok", Data: doc.data() };

      return { Status: "Fail", Data: "Booking not found" };
    } catch (err) {
      return { Status: "Fail", Data: err.message };
    }
  };

  // ================= BOOKINGS BY USER =================

getBookingsByUser = async (userId) => {

  try {

    const snap = await firebaseDB
      .collection("booking")
      .where("CustomerId", "==", userId)
      .get();

    const bookings = [];

    for (const doc of snap.docs) {

      const booking = doc.data();

      // VEHICLE DETAILS
      const vehicleSnap = await firebaseDB
        .collection("Vehicle")
        .where("_id", "==", booking.VehicleId)
        .get();

      bookings.push({
        FirestoreId: doc.id,
        Booking: booking,
        CarDetails: vehicleSnap.empty
          ? null
          : vehicleSnap.docs[0].data()
      });

    }

    return {
      Status: "Ok",
      Data: bookings
    };

  } catch (err) {

    return {
      Status: "Fail",
      Data: err.message
    };

  }

};
// ================= UPDATE BOOKING (ADD THIS METHOD) =================
  updateBooking = async (id, updateData) => {
    try {
      if (!id) return { Status: "Fail", Data: "Booking ID required" };

      const bookingRef = firebaseDB.collection("booking").doc(id);
      const doc = await bookingRef.get();

      if (!doc.exists) {
        return { Status: "Fail", Data: "Booking not found" };
      }

      // Update in Firestore
      await bookingRef.update(updateData);

      // Return the updated data so frontend can refresh instantly
      return { 
        Status: "Ok", 
        Data: "Booking Successfully Updated",
        UpdatedFields: updateData 
      };
    } catch (err) {
      console.error("UpdateBooking Error:", err);
      return { Status: "Fail", Data: err.message };
    }
  };

  // ================= DELETE =================
  deleteBooking = async (id) => {
    try {
      if (!id) return { Status: "Fail", Data: "Booking ID required" };
      await firebaseDB.collection("booking").doc(id).delete();
      return { Status: "Ok", Data: "Booking Successfully Deleted" };
    } catch (err) {
      return { Status: "Fail", Data: err.message };
    }
  };
  
}

module.exports = new ManageBooking();
