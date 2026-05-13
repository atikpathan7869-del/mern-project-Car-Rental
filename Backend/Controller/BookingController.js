const manageBooking = require("../DBOperation/manageBooking_master.js");

class BookingController {
  // CREATE Booking
  saveBooking = async (req, res) => {
    try {
      const result = await manageBooking.saveBooking(req.body);

      // ❗ FIX: Case match "Ok"
      if (result.Status === "Ok") {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // READ All Bookings
  getAllBookings = async (req, res) => {
    try {
      const result = await manageBooking.getAllBookings();

      // ❗ FIX: Case match "Ok"
      if (result.Status === "Ok") {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // READ Single Booking
  getBookingById = async (req, res) => {
    try {
      const result = await manageBooking.getBookingById(req.params.id);

      // ❗ FIX: Case match "Ok"
      if (result.Status === "Ok") {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // UPDATE Booking
  updateBooking = async (req, res) => {
    try {
      const result = await manageBooking.updateBooking(req.params.id, req.body);

      // ❗ FIX: Case match "Ok"
      if (result.Status === "Ok") {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // DELETE Booking
  deleteBooking = async (req, res) => {
    try {
      const result = await manageBooking.deleteBooking(req.params.id);

      // ❗ FIX: Case match "Ok"
      if (result.Status === "Ok") {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

// READ: Bookings by Customer
getBookingsByUser = async (req, res) => {
  try {

    const userId = req.params.userId;   // FIX HERE

    const result = await manageBooking.getBookingsByUser(userId);

    if (result.Status === "Ok") {
      return res.status(200).json(result);
    }

    return res.status(200).json({
      Status: "Ok",
      Data: []
    });

  } catch (error) {

    return res.status(500).json({
      Status: "Fail",
      Data: error.message
    });

  }
};

  // CANCEL Booking
  cancelBooking = async (req, res) => {
    try {
      const result = await manageBooking.cancelBooking(req.params.id);
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(400).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // UPDATE: Change payment_status (Firestore version)
  updateBookingStatus = async (req, res) => {
    try {
      const { payment_status } = req.body;
      const id = req.params.id;

      if (!payment_status) {
        return res.status(400).json({ Status: "Fail", Data: "payment_status is required" });
      }

      const result = await manageBooking.getBookingById(id);

      if (result.Status !== "Ok") {
        return res.status(404).json({ Status: "Fail", Data: "Booking not found" });
      }

      // Get Firestore doc ID
      const bookingSnap = await firebaseDB.collection("booking").doc(id).get();

      if (bookingSnap.exists) {
        await firebaseDB.collection("booking").doc(id).update({
          payment_status,
          UpdatedDate: new Date().toISOString()
        });

        return res.status(200).json({ Status: "Ok", Data: "Payment status updated successfully" });
      }

      // If Firestore ID not found, search by _id field
      const snap = await firebaseDB.collection("booking").where("_id", "==", parseInt(id)).get();
      if (snap.empty) return res.status(404).json({ Status: "Fail", Data: "Booking not found" });

      let docId = null;
      snap.forEach(d => docId = d.id);

      await firebaseDB.collection("booking").doc(docId).update({
        payment_status,
        UpdatedDate: new Date().toISOString()
      });

      return res.status(200).json({ Status: "Ok", Data: "Payment status updated successfully" });
    } catch (error) {
      console.error("Error updating payment status:", error);
      return res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };
}

module.exports = new BookingController();
