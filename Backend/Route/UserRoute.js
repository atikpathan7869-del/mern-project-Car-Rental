const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

// Register
router.post("/register", userController.register);

// Login
router.post("/login", userController.login);

// Change Password (Moved UP to avoid conflict)
router.patch("/change-password/:id", userController.changePassword);

// Get all users
router.get("/", userController.getAllUsers);

// Get user by id
router.get("/:id", userController.getUserById);

// Update user
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
