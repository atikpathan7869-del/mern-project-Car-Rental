const managePayment = require("../DBOperation/managePayment");

class PaymentController {
  savePayment = async (req, res) => {
    try {
      const result = await managePayment.savePayment(req.body);

      if (result.Status === "OK") res.status(201).json(result);
      else res.status(400).json(result);
    } catch (error) {
      res.status(500).json({
        Status: "Fail",
        Data: error.message,
      });
    }
  };

  getAllPayments = async (req, res) => {
    try {
      const result = await managePayment.getAllPayments();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        Status: "Fail",
        Data: error.message,
      });
    }
  };

  getPaymentByBooking = async (req, res) => {
    try {
      const result = await managePayment.getPaymentByBooking(
        req.params.bookingId,
      );

      if (result.Status === "OK") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (error) {
      res.status(500).json({
        Status: "Fail",
        Data: error.message,
      });
    }
  };
}

module.exports = new PaymentController();
