const User = require("../models/User");

// GET API - Get all users
const getAllUsers =async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        message: "Users retrieved successfully",
        count: users.length,
        users: users,
    });
};

// POST API - Create User
const createUser = async (req, res) => {
    const {name, email, age} = req.body;

    const newUser = await User.create({
        name, email, age
    });
    res.status(201).json({
        message: "User created successfully",
        user: newUser,
    });
};

// GET API - Get user by ID
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json({
        message: "Data retrieved successfully",
        user,
    })
}

// PUT API - Update user by ID
const updateUser = async (req, res) => {
    const {name, email, age} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {name, email, age},
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if(!updatedUser) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
    });
}

// Delete API - Delete user by ID
const deleteUser = async (req, res) => {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if(!deleteUser) {
            res.status(404);
            throw new Error("User not found");
        }
        res.status(200).json({
            message: "User deleted successfully",
            user: deleteUser
        });
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
}