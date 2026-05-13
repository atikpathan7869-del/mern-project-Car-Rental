const manageAdmin = require("../DBOperation/manageAdmin");

class AdminController {
  // REGISTER
  register = async (req, res) => {
    try {
      const result = await manageAdmin.RegisterAdmin(req.body);

      // ❗ FIX: match service case "Ok"
      if (result.Status === "Ok") {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // LOGIN
  login = async (req, res) => {
    try {
      const result = await manageAdmin.LoginAdmin(req.body);

      // ❗ FIX: match service case "Ok"
      if (result.Status === "Ok") {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // GET ALL ADMINS
  getAllAdmins = async (req, res) => {
    try {
      const result = await manageAdmin.GetAllAdmins();
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(400).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // GET ADMIN BY ID
  getAdminById = async (req, res) => {
    try {
      const result = await manageAdmin.GetAdminById(req.params.id);
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // UPDATE ADMIN
  updateAdmin = async (req, res) => {
    try {
      const result = await manageAdmin.UpdateAdmin(req.params.id, req.body);
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // CHANGE PASSWORD (Fixed)
  changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await manageAdmin.ChangeAdminPassword({
        id: req.params.id,
        oldPassword,
        newPassword
      });

      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(400).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // DELETE ADMIN
  deleteAdmin = async (req, res) => {
    try {
      const result = await manageAdmin.DeleteAdmin(req.params.id);
      if (result.Status === "Ok") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };
}

module.exports = new AdminController();
