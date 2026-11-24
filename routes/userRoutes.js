const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");

// GET - Get all users
router.get("/", getAllUsers);

// POST - Create user
router.post("/", createUser);

// GET - Get users by ID
router.get("/:id", getUserById);

// PUT - Update user by ID
router.put("/:id", updateUser);

// DELETE - Delete user by ID
router.delete("/:id", deleteUser);

module.exports = router;