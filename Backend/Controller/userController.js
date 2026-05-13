const manageUsers = require("../DBOperation/manageUsers");

class userController {
  // Register
  register = async (req, res) => {
    try {
      const result = await manageUsers.RegisterUser(req.body);
      if (result.Status === "OK") res.status(201).json(result);
      else res.status(400).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // Login (Fixed)
  login = async (req, res) => {
    try {
      const { Email, Phone, Password } = req.body;

      const username = Email || Phone; // user email ya phone se login kar sakta hai
      const result = await manageUsers.LoginUser(username, Password);

      if (result.Status === "OK") res.status(200).json(result);
      else res.status(401).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // Get All Users
  getAllUsers = async (req, res) => {
    try {
      const result = await manageUsers.GetAllUsers();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // Get User By ID
  getUserById = async (req, res) => {
    try {
      const result = await manageUsers.GetUserById(req.params.id);
      if (result.Status === "OK") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // Update User
  updateUser = async (req, res) => {
    try {
      const result = await manageUsers.UpdateUser(req.params.id, req.body);
      if (result.Status === "OK") res.status(200).json(result);
      else res.status(400).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // Delete User
  deleteUser = async (req, res) => {
    try {
      const result = await manageUsers.DeleteUser(req.params.id);
      if (result.Status === "OK") res.status(200).json(result);
      else res.status(404).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };

  // Change Password
  changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await manageUsers.ChangePassword(req.params.id, oldPassword, newPassword);
      if (result.Status === "OK") res.status(200).json(result);
      else res.status(400).json(result);
    } catch (error) {
      res.status(500).json({ Data: error.message, Status: "Fail" });
    }
  };
}

module.exports = new userController();
