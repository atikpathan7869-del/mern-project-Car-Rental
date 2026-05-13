const { firebaseDB } = require("../Faierbase_Config/index");

class ManageBookingAllocation {
  // CREATE Allocation
  SaveBookingAllocation = async (data) => {
    try {
      const allocationRef = firebaseDB.collection("BookingAllocation");
      const bookingRef = firebaseDB.collection("booking");
      const vehicleRef = firebaseDB.collection("Vehicle");

      const bookingId = parseInt(data.BookingId);
      const vehicleId = parseInt(data.VehicleId);

      // Check if Booking exists
      const bookingSnap = await bookingRef.where("_id", "==", bookingId).get();
      if (bookingSnap.empty) {
        return { Status: "Fail", Data: "BookingId does not exist" };
      }

      // Check if Vehicle exists
      const vehicleSnap = await vehicleRef.where("_id", "==", vehicleId).get();
      if (vehicleSnap.empty) {
        return { Status: "Fail", Data: "VehicleId does not exist" };
      }

      // Auto-increment Allocation _id using Counter
      const counterRef = firebaseDB.collection("Counters").doc("CarAllocationCounter");
      const counterDoc = await counterRef.get();
      let newId = 1;

      if (counterDoc.exists) {
        newId = counterDoc.data().lastId + 1;
      }

      await counterRef.set({ lastId: newId });

      const newAllocation = {
        _id: newId,
        BookingId: bookingId,
        VehicleId: vehicleId,
        CreatedDate: new Date().toISOString(),
      };

      const doc = await allocationRef.add(newAllocation);

      return { Status: "Ok", Data: "Allocation Saved", Allocation: newAllocation, FirestoreId: doc.id };
    } catch (err) {
      console.error("Error saving allocation:", err);
      return { Status: "Fail", Data: err.message };
    }
  };

  // READ All Allocations with Booking & Vehicle Details
  GetAllocations = async () => {
    try {
      const allocationSnap = await firebaseDB.collection("BookingAllocation").get();
      const result = [];

      for (const doc of allocationSnap.docs) {
        const allocation = doc.data();

        // Fetch Booking Details
        const bookingSnap = await firebaseDB
          .collection("booking")
          .where("_id", "==", allocation.BookingId)
          .get();

        // Fetch Vehicle Details
        const vehicleSnap = await firebaseDB
          .collection("Vehicle")
          .where("_id", "==", allocation.VehicleId)
          .get();

        result.push({
          FirestoreId: doc.id,
          Allocation: allocation,
          BookingDetails: bookingSnap.empty ? null : bookingSnap.docs[0].data(),
          VehicleDetails: vehicleSnap.empty ? null : vehicleSnap.docs[0].data(),
        });
      }

      return { Status: "Ok", Data: result };
    } catch (err) {
      return { Status: "Fail", Data: err.message };
    }
  };

  // UPDATE Allocation by _id or Firestore doc ID
  UpdateBookingAllocation = async (id, updateData) => {
    try {
      const allocationRef = firebaseDB.collection("BookingAllocation");

      // Try Firestore doc ID first
      const doc = await allocationRef.doc(id).get();
      if (doc.exists) {
        await allocationRef.doc(id).update({
          ...updateData,
          UpdatedDate: new Date().toISOString(),
        });
        return { Status: "Ok", Data: "Allocation Updated Successfully" };
      }

      // Else try _id field
      const snap = await allocationRef.where("_id", "==", parseInt(id)).get();
      if (snap.empty) return { Status: "Fail", Data: "Allocation Not Found" };

      let docId = null;
      snap.forEach((d) => (docId = d.id));

      await allocationRef.doc(docId).update({
        ...updateData,
        UpdatedDate: new Date().toISOString(),
      });

      return { Status: "Ok", Data: "Allocation Updated Successfully" };
    } catch (err) {
      console.error("Error updating allocation:", err);
      return { Status: "Fail", Data: err.message };
    }
  };

  // DELETE Allocation by Firestore doc ID or _id
  DeleteBookingAllocation = async (id) => {
    try {
      const allocationRef = firebaseDB.collection("BookingAllocation");

      // Try Firestore ID
      const doc = await allocationRef.doc(id).get();
      if (doc.exists) {
        await allocationRef.doc(id).delete();
        return { Status: "Ok", Data: "Allocation Deleted Successfully" };
      }

      // Try _id field
      const snap = await allocationRef.where("_id", "==", parseInt(id)).get();
      if (snap.empty) return { Status: "Fail", Data: "Allocation Not Found" };

      let docId = null;
      snap.forEach((d) => (docId = d.id));

      await allocationRef.doc(docId).delete();
      return { Status: "Ok", Data: "Allocation Deleted Successfully" };
    } catch (err) {
      console.error("Error deleting allocation:", err);
      return { Status: "Fail", Data: err.message };
    }
  };
}

module.exports = new ManageBookingAllocation();
