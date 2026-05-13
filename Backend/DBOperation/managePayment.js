const { firebaseDB } = require("../Faierbase_Config/index");

class ManagePayment {

  // ================= SAVE PAYMENT =================
  // ... existing code ...
savePayment = async (paymentData) => { 
    try {
      if (!paymentData.BookingId)
        return { Status: "Fail", Data: "BookingId required" };

      const statusToSet = paymentData.PaymentStatus || "Paid";

      const newPayment = {
        BookingId: paymentData.BookingId,
        UserId: paymentData.UserId || "",
        Amount: Number(paymentData.Amount || 0),
        PaymentMethod: paymentData.PaymentMethod || "UPI",
        UpiId: paymentData.UpiId || "",
        PaymentStatus: statusToSet,
        CreatedDate: new Date().toISOString()
      };

      const doc = await firebaseDB.collection("payments").add(newPayment);

      await firebaseDB.collection("booking").doc(paymentData.BookingId).update({
        payment_status: statusToSet
      });

      return {
        Status: "OK",
        Data: "Payment Saved Successfully",
        PaymentId: doc.id
      };
    } catch (err) {
      return { Status: "Fail", Data: err.message };
    }
  };
// ... existing code ...

  // ================= GET ALL PAYMENTS =================
  getAllPayments = async () => {

    try {

      const snapshot = await firebaseDB
        .collection("payments")
        .get();

      const payments = [];

      snapshot.forEach(doc => {

        payments.push({
          Id: doc.id,
          Payment: doc.data()
        });

      });

      return {
        Status: "OK",
        Data: payments
      };

    } catch (err) {

      return { Status: "Fail", Data: err.message };

    }

  };

  // ================= GET PAYMENT BY BOOKING =================
  getPaymentByBooking = async (bookingId) => {

    try {

      const snap = await firebaseDB
        .collection("payments")
        .where("BookingId", "==", bookingId)
        .get();

      if (snap.empty)
        return { Status: "Fail", Data: "Payment not found" };

      const payments = [];

      snap.forEach(doc => {

        payments.push({
          Id: doc.id,
          Payment: doc.data()
        });

      });

      return {
        Status: "OK",
        Data: payments
      };

    } catch (err) {

      return { Status: "Fail", Data: err.message };

    }

  };

}

module.exports = new ManagePayment();