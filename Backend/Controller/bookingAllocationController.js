// Controller/bookingAllocationController.js
const manageBookingAllocation = require("../DBOperation/manageBookingAllocation");

class bookingAllocationController {
  //  CREATE Allocation
  saveAllocation = async (req, res) => {
    try {
      const result = await manageBookingAllocation.SaveBookingAllocation(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  READ All Allocations
  getAllocations = async (req, res) => {
    try {
      const result = await manageBookingAllocation.GetAllocations();
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  //  UPDATE Allocation
  updateAllocation = async (req, res) => {
    try {
      const id = req.params.id; // AllocationId from URL
      const result = await manageBookingAllocation.UpdateBookingAllocation(id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };

  // DELETE Allocation
  deleteAllocation = async (req, res) => {
    try {
      const id = req.params.id; // AllocationId from URL
      const result = await manageBookingAllocation.DeleteBookingAllocation(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ Status: "Fail", Data: error.message });
    }
  };
}

module.exports = new bookingAllocationController();
