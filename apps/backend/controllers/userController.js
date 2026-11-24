const User = require("../models/User");

// GET API - Get all users
const getAllUsers =async (req, res) => {
    try{
        const users = await User.find();

        res.status(200).json({
            message: "Users retrieved successfully",
            count: users.length,
            users: users,
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// POST API - Create User
const createUser = async (req, res) => {
    try{
        const {name, email, age} = req.body;

        const newUser = await User.create({
            name, email, age 
        });
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// GET API - Get user by ID
const getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "Data retrieved successfully",
            user,
        })
    } catch (err){
        res.status(500).json({
            message: err.message,
        })
    }
}

// PUT API - Update user by ID
const updateUser = async (req, res) => {
    try{
         console.log("Params:", req.params);
        console.log("User ID:", req.params.id);
        console.log("Body:", req.body);
        
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
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

// Delete API - Delete user by ID
const deleteUser = async (req, res) => {
    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if(!deleteUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "User deleted successfully",
            user: deleteUser
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
}