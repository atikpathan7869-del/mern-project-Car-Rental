const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");

// REGISTER
router.post("/register", adminController.register);

// LOGIN
router.post("/login", adminController.login);

// CHANGE PASSWORD (moved ABOVE /:id)
router.put("/change-password/:id", adminController.changePassword);

// UPDATE ADMIN PASSWORD (if you want separate endpoint)
router.put("/ChangePassword/:id", adminController.changePassword);

// GET ALL ADMINS
router.get("/all", adminController.getAllAdmins); // 👈 cleaner than "/"

// GET ADMIN BY _id or Firestore doc ID
router.get("/:id", adminController.getAdminById); // 👈 must be last param route

// UPDATE ADMIN
router.put("/update/:id", adminController.updateAdmin);

// DELETE ADMIN
router.delete("/delete/:id", adminController.deleteAdmin);

module.exports = router;
